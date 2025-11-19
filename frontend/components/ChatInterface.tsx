'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Loader2, Send, Bot, User, FileCode } from 'lucide-react';
import { useApp } from '@/app/providers';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const { currentContract } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-notify when contract is analyzed
  useEffect(() => {
    if (currentContract) {
      const notification: Message = {
        role: 'assistant',
        content: `I've analyzed the contract **${currentContract.name}** at ${currentContract.address.slice(0, 10)}...${currentContract.address.slice(-8)}

Now you can ask me specific questions about this contract! Try:
- "What does this contract do?"
- "Explain the main functions"
- "Is this contract safe?"
- "What are the risks?"`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, notification]);
    }
  }, [currentContract]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 🔥 BUILD CONTEXT-AWARE MESSAGE
      let messageToSend = input;
      
      if (currentContract) {
        // Add contract context to the message
        messageToSend = `Context: I'm asking about the smart contract "${currentContract.name}" at address ${currentContract.address}.

Previous AI Analysis:
${currentContract.analysis}

Key Functions: ${currentContract.abi.filter((item: any) => item.type === 'function').slice(0, 5).map((fn: any) => fn.name).join(', ')}

User Question: ${input}

Please answer specifically about THIS contract, not general smart contract info.`;
      }

      const response = await api.chat(messageToSend);
      
      const aiMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Smart Contract Assistant
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">Ask me anything about Ethereum contracts</p>
          {currentContract && (
            <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
              <FileCode className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-300 font-medium">
                {currentContract.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Start a conversation!</p>
            <p className="text-sm mt-2">Analyze a contract first, or ask general questions</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <span className="text-xs opacity-50 mt-1 block">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentContract ? `Ask about ${currentContract.name}...` : "Ask about smart contracts..."}
            className="flex-1 bg-white/5 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-medium transition-colors flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}