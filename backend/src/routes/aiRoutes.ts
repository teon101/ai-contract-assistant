import express, { Request, Response } from 'express';
import { aiService } from '../services/aiService';

const router = express.Router();

// Test AI chat
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await aiService.chat(message);
    
    res.json({ 
      success: true,
      response 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;