import { ethers } from 'ethers';
import axios from 'axios';

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private etherscanApiKey: string;

  constructor() {
    const rpcUrl = process.env.PUBLIC_RPC_URL || 
                   `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
    
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.etherscanApiKey = process.env.ETHERSCAN_API_KEY || '';
    console.log('🔑 Etherscan API Key:', this.etherscanApiKey ? 'Found' : 'Missing');
  }

  async getContractInfo(address: string) {
    try {
      console.log('🔍 Getting contract info for:', address);
      
      // Validate address
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid Ethereum address');
      }

      // Get contract code to verify it's a contract
      const code = await this.provider.getCode(address);
      if (code === '0x') {
        throw new Error('This address is not a contract');
      }
      console.log('✅ Contract code found');

      // Get contract ABI and source from Etherscan V2
      console.log('📡 Fetching from Etherscan V2...');
      const etherscanData = await this.getContractFromEtherscanV2(address);
      console.log('📦 Etherscan data received');

      // Get basic info
      const balance = await this.provider.getBalance(address);

      return {
        address,
        balance: ethers.formatEther(balance),
        isContract: true,
        name: etherscanData.ContractName || 'Unknown',
        abi: etherscanData.ABI ? JSON.parse(etherscanData.ABI) : [],
        sourceCode: etherscanData.SourceCode || 'Source not verified',
        compiler: etherscanData.CompilerVersion || 'Unknown',
        isVerified: etherscanData.ABI ? true : false,
        proxy: etherscanData.Proxy || '0'
      };
    } catch (error: any) {
      console.error('❌ Blockchain Service Error:', error);
      throw new Error(error.message || 'Failed to fetch contract info');
    }
  }

  private async getContractFromEtherscanV2(address: string) {
    try {
      // Etherscan V2 API endpoint
      const url = `https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getsourcecode&address=${address}&apikey=${this.etherscanApiKey}`;
      console.log('🌐 Calling Etherscan V2 API...');
      
      const response = await axios.get(url);
      console.log('📊 Response status:', response.data.status);
      console.log('📊 Response message:', response.data.message);

      if (response.data.status === '0') {
        console.error('❌ Etherscan API Error:', response.data.result);
        return {};
      }

      if (response.data.status === '1' && response.data.result && response.data.result.length > 0) {
        const contractData = response.data.result[0];
        console.log('✅ Contract Name:', contractData.ContractName || 'Not found');
        console.log('✅ Verified:', contractData.ABI ? 'Yes' : 'No');
        return contractData;
      }

      console.log('⚠️ No contract data found');
      return {};
    } catch (error: any) {
      console.error('❌ Etherscan API Error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      return {};
    }
  }

  async getWalletInfo(address: string) {
    try {
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid Ethereum address');
      }

      const balance = await this.provider.getBalance(address);
      const txCount = await this.provider.getTransactionCount(address);

      return {
        address,
        balance: ethers.formatEther(balance),
        transactionCount: txCount,
        isContract: (await this.provider.getCode(address)) !== '0x'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch wallet info');
    }
  }
}

export const blockchainService = new BlockchainService();