import express, { Request, Response } from 'express';
import { blockchainService } from '../services/blockchainService';
import { aiService } from '../services/aiService';
import { securityService } from '../services/securityService';

const router = express.Router();

// Get supported chains
router.get('/chains', (req: Request, res: Response) => {
  const chains = blockchainService.getSupportedChains();
  res.json({ success: true, chains });
});

// Analyze contract
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { address, chain = 'ethereum' } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Contract address is required' });
    }

    const contractInfo = await blockchainService.getContractInfo(address, chain);
    const securityReport = await securityService.analyzeContract(address, contractInfo.abi);

    const analysisPrompt = `Analyze this contract with security context:
    
Contract: ${contractInfo.name}
Chain: ${contractInfo.chain}
Security Score: ${securityReport.score}/100 (${securityReport.risk} risk)
Warnings: ${securityReport.warnings.join(', ')}

Provide a brief analysis.`;

    const analysis = await aiService.analyzeContract({
      ...contractInfo,
      securityContext: analysisPrompt
    });

    res.json({
      success: true,
      contract: contractInfo,
      security: securityReport,
      analysis
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get contract info only
router.get('/info/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { chain = 'ethereum' } = req.query;
    const contractInfo = await blockchainService.getContractInfo(address, chain as string);

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