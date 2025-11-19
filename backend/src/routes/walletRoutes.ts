import express, { Request, Response } from 'express';
import { blockchainService } from '../services/blockchainService';

const router = express.Router();

// Get wallet info
router.get('/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const walletInfo = await blockchainService.getWalletInfo(address);

    res.json({
      success: true,
      wallet: walletInfo
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;