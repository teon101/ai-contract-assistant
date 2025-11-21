import express, { Request, Response } from 'express';
import { blockchainService } from '../services/blockchainService';

const router = express.Router();

// Get transaction history
router.get('/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { chain = 'ethereum', limit = '10' } = req.query;
    const limitNum = parseInt(limit as string) || 10;

    const transactions = await blockchainService.getTransactionHistory(
      address, 
      chain as string, 
      limitNum
    );

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;