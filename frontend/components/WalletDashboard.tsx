'use client';

import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, LogOut, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function WalletDashboard() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
        <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400 mb-6">
          Connect your wallet to see your balance, tokens, and transaction history
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          Your Wallet
        </h2>
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 mb-4 border border-blue-500/30">
        <p className="text-gray-400 text-sm mb-1">Total Balance</p>
        <p className="text-4xl font-bold text-white mb-2">
          {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'} ETH
        </p>
        <p className="text-gray-400 text-sm">
          ≈ ${balance ? (parseFloat(balance.formatted) * 2000).toFixed(2) : '0.00'} USD
        </p>
      </div>

      {/* Address */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <p className="text-gray-400 text-xs mb-2">Wallet Address</p>
        <div className="flex items-center gap-2">
          <p className="text-white font-mono text-sm flex-1 break-all">
            {address}
          </p>
          <button
            onClick={copyAddress}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            {copied ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-white font-medium transition-colors">
          View Tokens
        </button>
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-white font-medium transition-colors">
          Transactions
        </button>
      </div>

      {/* Network Info */}
      <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-300 text-sm">Connected to Ethereum Mainnet</span>
      </div>
    </div>
  );
}