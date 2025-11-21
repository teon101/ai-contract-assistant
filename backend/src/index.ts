import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes';
import contractRoutes from './routes/contractRoutes';
import walletRoutes from './routes/walletRoutes';
import priceRoutes from './routes/priceRoutes'; // 🆕 ADD THIS
import transactionRoutes from './routes/transactionRoutes';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/price', priceRoutes); // 🆕 ADD THIS
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Smart Contract AI Assistant API is running',
    ai: process.env.GROQ_API_KEY ? 'Groq Connected ✅' : 'No AI Key ❌',
    blockchain: process.env.PUBLIC_RPC_URL ? 'Public RPC Connected ✅' : 'No RPC ❌'
  });
});

// Root
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to Smart Contract AI Assistant API',
    version: '0.2.0',
    endpoints: {
  health: '/health',
  chat: 'POST /api/ai/chat',
  analyzeContract: 'POST /api/contracts/analyze',
  contractInfo: 'GET /api/contracts/info/:address',
  walletInfo: 'GET /api/wallet/:address',
  tokenPrice: 'GET /api/price/token/:address',
  ethPrice: 'GET /api/price/eth',
  transactions: 'GET /api/transactions/:address' // ADD THIS
}
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Codespace URL: Check PORTS tab`);
  console.log(`🤖 AI: Groq (Llama 3.1)`);
  console.log(`⛓️  Blockchain: Public RPC`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});