'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Zap, Settings } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Smart Contract AI</h1>
            <p className="text-xs text-gray-400">Connected Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}