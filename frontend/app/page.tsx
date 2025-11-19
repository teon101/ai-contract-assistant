import ChatInterface from '@/components/ChatInterface';
import ContractAnalyzer from '@/components/ContractAnalyzer';
import WalletDashboard from '@/components/WalletDashboard';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Smart Contract AI Assistant
          </h1>
          <p className="text-xl text-gray-300">
            Understand and interact with Ethereum smart contracts using AI
          </p>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
          {/* Left: Wallet */}
          <div className="lg:col-span-1">
            <WalletDashboard />
          </div>

          {/* Middle: Contract Analyzer */}
          <div className="lg:col-span-1">
            <ContractAnalyzer />
          </div>

          {/* Right: Chat */}
          <div className="lg:col-span-1">
            <ChatInterface />
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="text-sm font-bold text-white mb-1">Contract Analysis</h3>
            <p className="text-xs text-gray-400">AI-powered insights</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="text-sm font-bold text-white mb-1">AI Chat</h3>
            <p className="text-xs text-gray-400">Natural language</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-sm font-bold text-white mb-1">Wallet</h3>
            <p className="text-xs text-gray-400">Connect MetaMask</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <h3 className="text-sm font-bold text-white mb-1">Risk Detection</h3>
            <p className="text-xs text-gray-400">Security checks</p>
          </div>
        </div>
      </div>
    </main>
  );
}