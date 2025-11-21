import express, { Request, Response } from 'express';
import { priceService } from '../services/priceService';

const router = express.Router();

// Get token price by contract address
router.get('/token/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const priceData = await priceService.getTokenPrice(address);

    if (!priceData) {
      return res.status(404).json({
        success: false,
        error: 'Token price not found. Token may not be listed on CoinGecko.'
      });
    }

    res.json({
      success: true,
      data: priceData
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get ETH price
router.get('/eth', async (req: Request, res: Response) => {
  try {
    const price = await priceService.getEthPrice();
    res.json({
      success: true,
      price
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;