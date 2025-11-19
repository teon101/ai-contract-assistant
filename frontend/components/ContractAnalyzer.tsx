'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Loader2, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '@/app/providers';

export default function ContractAnalyzer() {
  const { setCurrentContract } = useApp();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const analyzeContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || loading) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await api.analyzeContract(address);
      setResult(data);

      // 🔥 SAVE CONTRACT TO CONTEXT FOR CHAT
      setCurrentContract({
        address: data.contract.address,
        name: data.contract.name,
        abi: data.contract.abi,
        analysis: data.analysis,
        isVerified: data.contract.isVerified,
        balance: data.contract.balance,
        compiler: data.contract.compiler
      });

      console.log('✅ Contract saved to context for chat!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Contract Analyzer</h2>
      
      {/* Input Form */}
      <form onSubmit={analyzeContract} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter contract address (0x...)"
            className="flex-1 bg-white/5 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl px-6 py-3 font-medium transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Contract Info */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Contract Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Name</p>
                <p className="text-white font-medium">{result.contract.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Verified</p>
                <p className={`font-medium ${result.contract.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                  {result.contract.isVerified ? 'Yes ✓' : 'No ✗'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Balance</p>
                <p className="text-white font-medium">{result.contract.balance} ETH</p>
              </div>
              <div>
                <p className="text-gray-400">Compiler</p>
                <p className="text-white font-medium text-xs">{result.contract.compiler.slice(0, 20)}...</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-400 text-xs">Address</p>
              <p className="text-white font-mono text-xs break-all">{result.contract.address}</p>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-white mb-3">🤖 AI Analysis</h3>
            <p className="text-gray-200 whitespace-pre-wrap">{result.analysis}</p>
          </div>

          {/* Chat Prompt */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
            <p className="text-green-300 text-sm">
              💬 <strong>Contract loaded!</strong> You can now ask the AI questions about this contract in the chat.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}