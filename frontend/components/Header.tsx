'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Smart Contract AI</h1>
            <p className="text-xs text-gray-400">Powered by AI</p>
          </div>
        </div>

        <ConnectButton />
      </div>
    </header>
  );
}