import axios from 'axios';
import { ethers } from 'ethers';

interface SecurityReport {
  score: number; // 0-100 (100 = safest)
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  checks: {
    isHoneypot: boolean;
    hasHighTax: boolean;
    hasBlacklist: boolean;
    hasPausable: boolean;
    hasMintFunction: boolean;
    ownershipRenounced: boolean;
    isProxy: boolean;
    isOpenSource: boolean;
  };
  warnings: string[];
  details: any;
}

export class SecurityService {
  private goplusAPI = 'https://api.gopluslabs.io/api/v1';

  async analyzeContract(address: string, abi: any[]): Promise<SecurityReport> {
    try {
      const checks = {
        isHoneypot: false,
        hasHighTax: false,
        hasBlacklist: false,
        hasPausable: false,
        hasMintFunction: false,
        ownershipRenounced: false,
        isProxy: false,
        isOpenSource: abi.length > 0
      };

      const warnings: string[] = [];
      let score = 100;

      // Check 1: GoPlus Security API (honeypot, taxes, etc)
      try {
        const goplusData = await this.checkGoPlus(address);
        
        if (goplusData) {
          // Honeypot check
          if (goplusData.is_honeypot === '1') {
            checks.isHoneypot = true;
            warnings.push('⚠️ CRITICAL: This is a honeypot! You cannot sell this token.');
            score -= 50;
          }

          // Tax check
          const buyTax = parseFloat(goplusData.buy_tax || '0');
          const sellTax = parseFloat(goplusData.sell_tax || '0');
          
          if (buyTax > 10 || sellTax > 10) {
            checks.hasHighTax = true;
            warnings.push(`⚠️ HIGH TAXES: Buy: ${buyTax}%, Sell: ${sellTax}%`);
            score -= 20;
          }

          // Ownership check
          if (goplusData.owner_address === '0x0000000000000000000000000000000000000000') {
            checks.ownershipRenounced = true;
            warnings.push('✅ Ownership renounced (good!)');
            score += 10;
          } else {
            warnings.push('⚠️ Owner still has control');
            score -= 10;
          }

          // Proxy check
          if (goplusData.is_proxy === '1') {
            checks.isProxy = true;
            warnings.push('⚠️ This is a proxy contract (can be upgraded)');
            score -= 15;
          }
        }
      } catch (error) {
        console.log('GoPlus API unavailable, continuing with ABI analysis');
      }

      // Check 2: Analyze ABI for dangerous functions
      if (abi.length > 0) {
        const functionNames = abi
          .filter((item: any) => item.type === 'function')
          .map((item: any) => item.name?.toLowerCase() || '');

        // Check for blacklist functions
        const blacklistKeywords = ['blacklist', 'block', 'ban'];
        if (functionNames.some((name: string) => blacklistKeywords.some(keyword => name.includes(keyword)))) {
          checks.hasBlacklist = true;
          warnings.push('⚠️ Contract has blacklist functions');
          score -= 15;
        }

        // Check for pause functions
        if (functionNames.some((name: string) => name.includes('pause'))) {
          checks.hasPausable = true;
          warnings.push('⚠️ Contract can be paused by owner');
          score -= 10;
        }

        // Check for mint functions
        if (functionNames.some((name: string) => name.includes('mint'))) {
          checks.hasMintFunction = true;
          warnings.push('⚠️ Contract has mint function (supply can increase)');
          score -= 10;
        }
      } else {
        warnings.push('⚠️ Contract not verified - cannot analyze source code');
        score -= 20;
      }

      // Determine risk level
      let risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      if (score >= 80) risk = 'LOW';
      else if (score >= 60) risk = 'MEDIUM';
      else if (score >= 40) risk = 'HIGH';
      else risk = 'CRITICAL';

      return {
        score: Math.max(0, Math.min(100, score)),
        risk,
        checks,
        warnings,
        details: {}
      };
    } catch (error: any) {
      console.error('Security analysis error:', error.message);
      throw new Error('Failed to perform security analysis');
    }
  }

  private async checkGoPlus(address: string): Promise<any> {
    try {
      // GoPlus free API for Ethereum
      const response = await axios.get(
        `${this.goplusAPI}/token_security/1?contract_addresses=${address.toLowerCase()}`
      );

      if (response.data.code === 1 && response.data.result) {
        return response.data.result[address.toLowerCase()];
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

export const securityService = new SecurityService();