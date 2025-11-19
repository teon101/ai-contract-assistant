import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  // AI Chat
  chat: async (message: string) => {
    const response = await axios.post(`${API_URL}/api/ai/chat`, { message });
    return response.data;
  },

  // Analyze Contract
  analyzeContract: async (address: string) => {
    const response = await axios.post(`${API_URL}/api/contracts/analyze`, { address });
    return response.data;
  },

  // Get Wallet Info
  getWalletInfo: async (address: string) => {
    const response = await axios.get(`${API_URL}/api/wallet/${address}`);
    return response.data;
  },

  // Health Check
  health: async () => {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  }
};