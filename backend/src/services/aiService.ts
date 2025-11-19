
import Groq from 'groq-sdk';

export class AIService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  async analyzeContract(contractData: any): Promise<string> {
    try {
      console.log('🤖 Starting AI analysis...');
      
      // Extract only the function names from ABI (to avoid token limits)
      const functions = contractData.abi
        .filter((item: any) => item.type === 'function')
        .slice(0, 20) // Limit to first 20 functions
        .map((fn: any) => ({
          name: fn.name,
          type: fn.stateMutability || 'unknown'
        }));

      const prompt = `Analyze this Ethereum smart contract:

Contract: ${contractData.name}
Address: ${contractData.address}
Verified: ${contractData.isVerified ? 'Yes' : 'No'}
Key Functions: ${JSON.stringify(functions, null, 2)}

Provide a brief analysis:
1. What does this contract do? (2 sentences)
2. Main functions and their purpose
3. Any risks or warnings for users

Keep it simple and concise.`;

      console.log('📤 Sending to AI...');
      
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a Web3 expert. Explain smart contracts simply and clearly.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 800
      });

      const result = completion.choices[0]?.message?.content;
      console.log('✅ AI response received');
      
      return result || 'Unable to analyze contract';
    } catch (error: any) {
      console.error('❌ AI Service Error:', error.message);
      console.error('Full error:', error);
      throw new Error('Failed to analyze contract with AI');
    }
  }

  async chat(message: string, conversationHistory: any[] = []): Promise<string> {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful Web3 and smart contract assistant. Help users understand blockchain, smart contracts, and crypto in simple terms.'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ];

      const completion = await this.groq.chat.completions.create({
        messages,
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0]?.message?.content || 'Sorry, I could not process that.';
    } catch (error) {
      console.error('Chat Error:', error);
      throw new Error('Failed to get AI response');
    }
  }
}

export const aiService = new AIService();