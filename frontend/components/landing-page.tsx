'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Zap, Shield, Activity, TrendingUp, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1535] to-[#0a0e27]">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">SmartChain AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-8">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-200">Powered by Advanced AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Intelligent Smart Contract
          <br />
          <span className="gradient-text">Analysis</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
          Advanced AI-powered analysis for blockchain professionals. Security audits, 
          real-time monitoring, and risk assessment in one powerful platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-cyan-500/50 flex items-center justify-center gap-2"
              >
                Connect Wallet
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </ConnectButton.Custom>
          
          <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all">
            Learn More
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span>Audited & Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-yellow-400" />
            <span>Real-time Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>24/7 Monitoring</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for Crypto Professionals
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to analyze, monitor, and secure your smart contracts
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-8 hover:bg-white/10 transition-all group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI-Powered Analysis</h3>
            <p className="text-gray-400">Advanced machine learning for in-depth smart contract analysis</p>
          </div>

          <div className="glass rounded-2xl p-8 hover:bg-white/10 transition-all group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Security Audit</h3>
            <p className="text-gray-400">Comprehensive security checks and vulnerability detection</p>
          </div>

          <div className="glass rounded-2xl p-8 hover:bg-white/10 transition-all group">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Real-time Monitoring</h3>
            <p className="text-gray-400">Live contract interaction tracking and monitoring</p>
          </div>

          <div className="glass rounded-2xl p-8 hover:bg-white/10 transition-all group">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Risk Assessment</h3>
            <p className="text-gray-400">Detailed risk metrics and portfolio health analysis</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="glass rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Secure Your Contracts?</h2>
          <p className="text-gray-400 text-lg mb-10">
            Join thousands of blockchain professionals using SmartChain AI
          </p>
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-xl inline-flex items-center gap-3"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </ConnectButton.Custom>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-gray-400">
          © 2025 SmartChain AI. Built by Teon 🚀
        </div>
      </footer>
    </div>
  );
}