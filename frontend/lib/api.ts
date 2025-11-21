import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  // AI Chat
  chat: async (message: string) => {
    const response = await axios.post(`${API_URL}/api/ai/chat`, { message });
    return response.data;
  },

  // Analyze Contract (with chain support)
  analyzeContract: async (address: string, chain: string = 'ethereum') => {
    const response = await axios.post(`${API_URL}/api/contracts/analyze`, { address, chain });
    return response.data;
  },

  // Get Supported Chains
  getSupportedChains: async () => {
    const response = await axios.get(`${API_URL}/api/contracts/chains`);
    return response.data;
  },

  // Get Wallet Info
  getWalletInfo: async (address: string, chain: string = 'ethereum') => {
    const response = await axios.get(`${API_URL}/api/wallet/${address}?chain=${chain}`);
    return response.data;
  },

  // Health Check
  health: async () => {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  },

  // Get Token Price
  getTokenPrice: async (address: string) => {
    const response = await axios.get(`${API_URL}/api/price/token/${address}`);
    return response.data;
  },

  // Get ETH Price
  getEthPrice: async () => {
    const response = await axios.get(`${API_URL}/api/price/eth`);
    return response.data;
  },

  // Get Transaction History
  getTransactions: async (address: string, chain: string = 'ethereum', limit: number = 10) => {
    const response = await axios.get(`${API_URL}/api/transactions/${address}?chain=${chain}&limit=${limit}`);
    return response.data;
  }
};