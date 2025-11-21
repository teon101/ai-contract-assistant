'use client';

import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { Copy, CheckCircle, Wallet, ExternalLink, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function WalletDashboard() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showTxs, setShowTxs] = useState(false);
  const [loadingTxs, setLoadingTxs] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const loadTransactions = async () => {
    if (!address) return;
    setLoadingTxs(true);
    try {
      const data = await api.getTransactions(address, 5);
      setTransactions(data.transactions);
      setShowTxs(true);
    } catch (error) {
      console.error('Failed to load transactions');
    } finally {
      setLoadingTxs(false);
    }
  };

  if (!isConnected || !address) {
    return null;
  }

  const ethBalance = balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000';
  const usdValue = balance ? (parseFloat(balance.formatted) * 2500).toFixed(2) : '0.00';

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold">Wallet</h3>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 mb-4 border border-cyan-500/20">
          <p className="text-gray-400 text-sm mb-2">Total Balance</p>
          <p className="text-4xl font-bold mb-2">{ethBalance} ETH</p>
          <p className="text-gray-400 text-sm">${usdValue} USD</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-gray-400 text-xs mb-2">Wallet Address</p>
          <div className="flex items-center gap-2">
            <p className="text-white font-mono text-sm flex-1 truncate">{address}</p>
            <button onClick={copyAddress} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
              {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h4 className="font-semibold mb-4">Portfolio Value</h4>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Today</span>
            <span className="text-green-400 font-semibold">+2.47%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-green-500 w-3/4 rounded-full"></div>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">${usdValue}</span>
          <span className="text-white font-semibold">${(parseFloat(usdValue) * 1.05).toFixed(2)}</span>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h4 className="font-semibold mb-4">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-sm font-medium transition-colors">
            View Tokens
          </button>
          <button onClick={loadTransactions} disabled={loadingTxs} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-sm font-medium transition-colors disabled:opacity-50">
            {loadingTxs ? 'Loading...' : 'Transactions'}
          </button>
        </div>
        <button onClick={() => disconnect()} className="w-full mt-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-xl p-3 text-sm font-medium transition-colors text-red-400">
          Disconnect
        </button>
      </div>

      {showTxs && transactions.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Recent Transactions</h4>
            <button onClick={() => setShowTxs(false)} className="text-xs text-gray-400 hover:text-white">Hide</button>
          </div>
          <div className="space-y-3">
            {transactions.map((tx, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {tx.from.toLowerCase() === address.toLowerCase() ? (
                      <ArrowUpRight className="w-4 h-4 text-red-400" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-green-400" />
                    )}
                    <span className={`text-xs font-medium ${tx.from.toLowerCase() === address.toLowerCase() ? 'text-red-400' : 'text-green-400'}`}>
                      {tx.from.toLowerCase() === address.toLowerCase() ? 'Sent' : 'Received'}
                    </span>
                  </div>
                  <span className="text-xs text-white font-medium">{parseFloat(tx.value).toFixed(4)} ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono truncate max-w-[120px]">
                    {tx.from.toLowerCase() === address.toLowerCase() ? tx.to : tx.from}
                  </span>
                  <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}