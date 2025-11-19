import { Telegraf, Context } from 'telegraf';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const API_URL = process.env.API_URL || 'http://localhost:5000';

// Start command
bot.start((ctx) => {
  ctx.reply(
    `🤖 *Welcome to Smart Contract AI Assistant!*

I can help you understand Ethereum smart contracts using AI.

*Commands:*
/analyze <address> - Analyze a smart contract
/wallet <address> - Get wallet information
/help - Show this message

*Chat Mode:*
Just send me any message to chat about Web3 and smart contracts!

Example: /analyze 0xdAC17F958D2ee523a2206206994597C13D831ec7`,
    { parse_mode: 'Markdown' }
  );
});

// Help command
bot.help((ctx) => {
  ctx.reply(
    `*Available Commands:*

🔍 /analyze <address>
Analyze any Ethereum smart contract
Example: \`/analyze 0xdAC17F958D2ee523a2206206994597C13D831ec7\`

💰 /wallet <address>
Get wallet balance and info
Example: \`/wallet 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\`

💬 *Chat Mode*
Send any message to chat with AI about smart contracts

📊 /health - Check bot status`,
    { parse_mode: 'Markdown' }
  );
});

// Analyze command
bot.command('analyze', async (ctx) => {
  const args = ctx.message.text.split(' ');
  
  if (args.length < 2) {
    return ctx.reply('❌ Please provide a contract address.\n\nExample:\n/analyze 0xdAC17F958D2ee523a2206206994597C13D831ec7');
  }

  const address = args[1];
  
  await ctx.reply('🔍 Analyzing contract... This may take a few seconds.');

  try {
    const response = await axios.post(`${API_URL}/api/contracts/analyze`, { address });
    const { contract, analysis } = response.data;

    const message = `✅ *Contract Analyzed*

📝 *Name:* ${contract.name}
${contract.isVerified ? '✓' : '✗'} *Verified:* ${contract.isVerified ? 'Yes' : 'No'}
💰 *Balance:* ${contract.balance} ETH
🔧 *Compiler:* ${contract.compiler.slice(0, 30)}...

📍 *Address:*
\`${contract.address}\`

🤖 *AI Analysis:*
${analysis}

💬 You can now ask me questions about this contract!`;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error: any) {
    console.error('Analyze error:', error.response?.data || error.message);
    await ctx.reply(`❌ Error: ${error.response?.data?.error || 'Failed to analyze contract'}`);
  }
});

// Wallet command
bot.command('wallet', async (ctx) => {
  const args = ctx.message.text.split(' ');
  
  if (args.length < 2) {
    return ctx.reply('❌ Please provide a wallet address.\n\nExample:\n/wallet 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  }

  const address = args[1];
  
  await ctx.reply('💰 Fetching wallet info...');

  try {
    const response = await axios.get(`${API_URL}/api/wallet/${address}`);
    const { wallet } = response.data;

    const message = `💰 *Wallet Information*

📍 *Address:*
\`${wallet.address}\`

💵 *Balance:* ${wallet.balance} ETH
📊 *Transactions:* ${wallet.transactionCount}
${wallet.isContract ? '📄 This is a smart contract' : '👤 This is a regular wallet'}`;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error: any) {
    console.error('Wallet error:', error.response?.data || error.message);
    await ctx.reply(`❌ Error: ${error.response?.data?.error || 'Failed to fetch wallet info'}`);
  }
});

// Health command
bot.command('health', async (ctx) => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    await ctx.reply(`✅ Bot is online!\n\n${JSON.stringify(response.data, null, 2)}`);
  } catch (error) {
    await ctx.reply('❌ Backend API is down!');
  }
});

// Chat mode - any text message
bot.on('text', async (ctx) => {
  const message = ctx.message.text;

  // Ignore commands
  if (message.startsWith('/')) return;

  await ctx.reply('🤖 Thinking...');

  try {
    const response = await axios.post(`${API_URL}/api/ai/chat`, { message });
    await ctx.reply(response.data.response);
  } catch (error: any) {
    console.error('Chat error:', error.response?.data || error.message);
    await ctx.reply('❌ Sorry, I encountered an error. Please try again.');
  }
});

// Error handling
bot.catch((err: any, ctx: Context) => {
  console.error('Bot error:', err);
  ctx.reply('❌ An unexpected error occurred. Please try again.');
});

// Launch bot
bot.launch()
  .then(() => {
    console.log('🤖 Telegram Bot is running!');
    console.log('📡 Connected to API:', API_URL);
  })
  .catch((error) => {
    console.error('Failed to start bot:', error);
    process.exit(1);
  });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));