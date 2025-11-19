import express, { Request, Response } from 'express';
import { blockchainService } from '../services/blockchainService';
import { aiService } from '../services/aiService';

const router = express.Router();

// Analyze contract
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    console.log('📝 Analyze request received');
    const { address } = req.body;

    if (!address) {
      console.log('❌ No address provided');
      return res.status(400).json({ error: 'Contract address is required' });
    }

    console.log('🔍 Fetching contract info for:', address);
    const contractInfo = await blockchainService.getContractInfo(address);
    console.log('✅ Contract info retrieved');

    console.log('🤖 Getting AI analysis...');
    const analysis = await aiService.analyzeContract(contractInfo);
    console.log('✅ AI analysis complete');

    res.json({
      success: true,
      contract: contractInfo,
      analysis
    });
  } catch (error: any) {
    console.error('❌ Error in analyze route:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get contract info only (no AI)
router.get('/info/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const contractInfo = await blockchainService.getContractInfo(address);

    res.json({
      success: true,
      contract: contractInfo
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;