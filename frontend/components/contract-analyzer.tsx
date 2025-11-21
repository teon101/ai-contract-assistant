'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useApp } from './providers';
import { Search, Loader2, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Shield } from 'lucide-react';

export default function ContractAnalyzer() {
  const { setCurrentContract } = useApp();
  const [address, setAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [chains, setChains] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Load supported chains
  useEffect(() => {
    const loadChains = async () => {
      try {
        const data = await api.getSupportedChains();
        setChains(data.chains);
      } catch (err) {
        console.error('Failed to load chains');
      }
    };
    loadChains();
  }, []);

  const analyzeContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || loading) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await api.analyzeContract(address, selectedChain);
      
      // Try to get token price (only for ethereum for now)
      let priceData = null;
      if (selectedChain === 'ethereum') {
        try {
          const priceResponse = await api.getTokenPrice(address);
          priceData = priceResponse.data;
        } catch (err) {
          console.log('Price not available for this token');
        }
      }

      setResult({
        ...data,
        price: priceData
      });

      setCurrentContract({
        address: data.contract.address,
        name: data.contract.name,
        abi: data.contract.abi,
        analysis: data.analysis,
        isVerified: data.contract.isVerified,
        balance: data.contract.balance,
        compiler: data.contract.compiler
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Analyzer Form */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold">Contract Analyzer</h3>
        </div>

        <form onSubmit={analyzeContract} className="space-y-4">
          {/* Chain Selector */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Select Chain</label>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id} className="bg-gray-900">
                  {chain.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address Input */}
          <div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter contract address (0x...)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !address.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-semibold transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze on {chains.find(c => c.id === selectedChain)?.name || 'Chain'}
              </>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium text-sm">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Chain Badge */}
          <div className="glass rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">⛓️</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Analyzed on</p>
                <p className="text-white font-semibold">{result.contract.chain}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">Chain ID: {result.contract.chainId}</span>
          </div>

          {/* Token Price Card */}
          {result.price && (
            <div className="glass rounded-2xl p-6 bg-gradient-to-r from-green-500/5 to-cyan-500/5 border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {result.price.priceChange24h >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                  <h4 className="font-semibold">Token Price</h4>
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded ${result.price.priceChange24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {result.price.priceChange24h >= 0 ? '+' : ''}{result.price.priceChange24h.toFixed(2)}%
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Current Price</p>
                  <p className="text-3xl font-bold text-white">${result.price.price.toFixed(result.price.price < 1 ? 6 : 2)}</p>
                  <p className="text-gray-400 text-xs mt-1">{result.price.symbol} / {result.price.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Market Cap</p>
                    <p className="text-sm font-medium text-white">
                      ${result.price.marketCap >= 1e9 
                        ? (result.price.marketCap / 1e9).toFixed(2) + 'B'
                        : (result.price.marketCap / 1e6).toFixed(2) + 'M'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">24h Volume</p>
                    <p className="text-sm font-medium text-white">
                      ${result.price.volume24h >= 1e9
                        ? (result.price.volume24h / 1e9).toFixed(2) + 'B'
                        : (result.price.volume24h / 1e6).toFixed(2) + 'M'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Report */}
          {result.security && (
            <div className={`glass rounded-2xl p-6 border ${
              result.security.risk === 'LOW' ? 'border-green-500/30 bg-green-500/5' :
              result.security.risk === 'MEDIUM' ? 'border-yellow-500/30 bg-yellow-500/5' :
              result.security.risk === 'HIGH' ? 'border-orange-500/30 bg-orange-500/5' :
              'border-red-500/30 bg-red-500/5'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className={`w-5 h-5 ${
                    result.security.risk === 'LOW' ? 'text-green-400' :
                    result.security.risk === 'MEDIUM' ? 'text-yellow-400' :
                    result.security.risk === 'HIGH' ? 'text-orange-400' :
                    'text-red-400'
                  }`} />
                  <h4 className="font-semibold">Security Analysis</h4>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.security.risk === 'LOW' ? 'bg-green-500/20 text-green-400' :
                  result.security.risk === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                  result.security.risk === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {result.security.risk} RISK
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Security Score</span>
                  <span className="text-2xl font-bold">{result.security.score}/100</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      result.security.score >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      result.security.score >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                      result.security.score >= 40 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${result.security.score}%` }}
                  ></div>
                </div>
              </div>

              {result.security.warnings.length > 0 && (
                <div className="space-y-2 mb-4">
                  {result.security.warnings.map((warning: string, idx: number) => (
                    <div key={idx} className="text-xs bg-white/5 rounded-lg p-2 border border-white/10">
                      {warning}
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                <div className="text-xs">
                  <span className={result.security.checks.isHoneypot ? 'text-red-400' : 'text-green-400'}>
                    {result.security.checks.isHoneypot ? '✗' : '✓'}
                  </span>
                  <span className="ml-2 text-gray-400">Honeypot Check</span>
                </div>
                <div className="text-xs">
                  <span className={result.security.checks.hasHighTax ? 'text-red-400' : 'text-green-400'}>
                    {result.security.checks.hasHighTax ? '✗' : '✓'}
                  </span>
                  <span className="ml-2 text-gray-400">Tax Check</span>
                </div>
                <div className="text-xs">
                  <span className={result.security.checks.ownershipRenounced ? 'text-green-400' : 'text-yellow-400'}>
                    {result.security.checks.ownershipRenounced ? '✓' : '⚠'}
                  </span>
                  <span className="ml-2 text-gray-400">Ownership</span>
                </div>
                <div className="text-xs">
                  <span className={result.security.checks.isOpenSource ? 'text-green-400' : 'text-yellow-400'}>
                    {result.security.checks.isOpenSource ? '✓' : '⚠'}
                  </span>
                  <span className="ml-2 text-gray-400">Open Source</span>
                </div>
              </div>
            </div>
          )}

          {/* Contract Info */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h4 className="font-semibold">Contract Information</h4>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-gray-400 text-sm">Name</span>
                <span className="text-white font-medium text-sm text-right">{result.contract.name}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-gray-400 text-sm">Verified</span>
                <span className={`font-medium text-sm ${result.contract.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                  {result.contract.isVerified ? '✓ Yes' : '✗ No'}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-gray-400 text-sm">Balance</span>
                <span className="text-white font-medium text-sm">{result.contract.balance} {selectedChain === 'bsc' ? 'BNB' : selectedChain === 'polygon' ? 'MATIC' : 'ETH'}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-gray-400 text-sm">Compiler</span>
                <span className="text-white font-medium text-xs break-all text-right max-w-[200px]">
                  {result.contract.compiler.slice(0, 30)}...
                </span>
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-gray-400 text-xs mb-2">Address</p>
                <p className="text-white font-mono text-xs break-all">{result.contract.address}</p>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="glass rounded-2xl p-6 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-xs">🤖</span>
              </div>
              <h4 className="font-semibold">AI Analysis</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {result.analysis}
            </p>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
            <p className="text-green-300 text-sm text-center">
              💬 Contract loaded! Ask questions in the AI chat →
            </p>
          </div>
        </>
      )}

      {!result && !loading && (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-gray-400 text-sm">
            Select a chain and enter a contract address
          </p>
        </div>
      )}
    </div>
  );
}