import { ethers } from 'ethers';
import axios from 'axios';

interface ChainConfig {
  name: string;
  rpcUrl: string;
  explorer: string;
  explorerApi: string;
  chainId: number;
}

const CHAINS: Record<string, ChainConfig> = {
  ethereum: {
    name: 'Ethereum',
    rpcUrl: process.env.PUBLIC_RPC_URL || 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    explorerApi: 'https://api.etherscan.io/v2/api',
    chainId: 1
  },
  bsc: {
    name: 'BSC',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',
    explorerApi: 'https://api.bscscan.com/api',
    chainId: 56
  },
  polygon: {
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    explorerApi: 'https://api.polygonscan.com/api',
    chainId: 137
  },
  arbitrum: {
    name: 'Arbitrum',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    explorerApi: 'https://api.arbiscan.io/api',
    chainId: 42161
  },
  base: {
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    explorerApi: 'https://api.basescan.org/api',
    chainId: 8453
  }
};

export class BlockchainService {
  private etherscanApiKey: string;

  constructor() {
    this.etherscanApiKey = process.env.ETHERSCAN_API_KEY || '';
  }

  private getProvider(chain: string): ethers.JsonRpcProvider {
    const config = CHAINS[chain];
    if (!config) {
      throw new Error(`Unsupported chain: ${chain}`);
    }
    return new ethers.JsonRpcProvider(config.rpcUrl);
  }

  async getContractInfo(address: string, chain: string = 'ethereum') {
    try {
      const provider = this.getProvider(chain);
      const config = CHAINS[chain];

      console.log(`🔍 Getting contract info for: ${address} on ${config.name}`);
      
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid address');
      }

      const code = await provider.getCode(address);
      if (code === '0x') {
        throw new Error('This address is not a contract');
      }
      console.log('✅ Contract code found');

      console.log('📡 Fetching from block explorer...');
      const explorerData = await this.getContractFromExplorer(address, chain);
      console.log('📦 Explorer data received');

      const balance = await provider.getBalance(address);

      return {
        address,
        balance: ethers.formatEther(balance),
        isContract: true,
        name: explorerData.ContractName || 'Unknown',
        abi: explorerData.ABI ? JSON.parse(explorerData.ABI) : [],
        sourceCode: explorerData.SourceCode || 'Source not verified',
        compiler: explorerData.CompilerVersion || 'Unknown',
        isVerified: explorerData.ABI ? true : false,
        chain: config.name,
        chainId: config.chainId
      };
    } catch (error: any) {
      console.error('❌ Blockchain Service Error:', error);
      throw new Error(error.message || 'Failed to fetch contract info');
    }
  }

  private async getContractFromExplorer(address: string, chain: string) {
    try {
      const config = CHAINS[chain];
      const url = chain === 'ethereum' 
        ? `${config.explorerApi}?chainid=${config.chainId}&module=contract&action=getsourcecode&address=${address}&apikey=${this.etherscanApiKey}`
        : `${config.explorerApi}?module=contract&action=getsourcecode&address=${address}&apikey=${this.etherscanApiKey}`;
      
      console.log('🌐 Calling block explorer API...');
      
      const response = await axios.get(url);
      console.log('📊 Response status:', response.data.status);

      if (response.data.status === '0') {
        console.error('❌ Explorer API Error:', response.data.result);
        return {};
      }

      if (response.data.status === '1' && response.data.result && response.data.result.length > 0) {
        const contractData = response.data.result[0];
        console.log('✅ Contract Name:', contractData.ContractName || 'Not found');
        return contractData;
      }

      console.log('⚠️ No contract data found');
      return {};
    } catch (error: any) {
      console.error('❌ Explorer API Error:', error.message);
      return {};
    }
  }

  async getWalletInfo(address: string, chain: string = 'ethereum') {
    try {
      const provider = this.getProvider(chain);
      
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid address');
      }

      const balance = await provider.getBalance(address);
      const txCount = await provider.getTransactionCount(address);

      return {
        address,
        balance: ethers.formatEther(balance),
        transactionCount: txCount,
        isContract: (await provider.getCode(address)) !== '0x',
        chain: CHAINS[chain].name
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch wallet info');
    }
  }

  async getTransactionHistory(address: string, chain: string = 'ethereum', limit: number = 10) {
    try {
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid address');
      }

      const config = CHAINS[chain];
      const url = chain === 'ethereum'
        ? `${config.explorerApi}?chainid=${config.chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${this.etherscanApiKey}`
        : `${config.explorerApi}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${this.etherscanApiKey}`;
      
      const response = await axios.get(url);

      if (response.data.status === '1' && response.data.result) {
        return response.data.result.map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: ethers.formatEther(tx.value),
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          blockNumber: tx.blockNumber,
          isError: tx.isError === '1',
          gasUsed: tx.gasUsed,
          gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei'),
          chain: config.name
        }));
      }

      return [];
    } catch (error: any) {
      console.error('Transaction history error:', error.message);
      throw new Error('Failed to fetch transaction history');
    }
  }

  getSupportedChains() {
    return Object.keys(CHAINS).map(key => ({
      id: key,
      name: CHAINS[key].name,
      chainId: CHAINS[key].chainId,
      explorer: CHAINS[key].explorer
    }));
  }
}

export const blockchainService = new BlockchainService();