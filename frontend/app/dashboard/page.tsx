'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import WalletDashboard from '@/components/wallet-dashboard';
import ContractAnalyzer from '@/components/contract-analyzer';
import AIChat from '@/components/ai-chat';
import DashboardHeader from '@/components/dashboard-header';

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1535] to-[#0a0e27]">
      <DashboardHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Wallet */}
          <div>
            <WalletDashboard />
          </div>

          {/* Middle: Contract Analyzer */}
          <div>
            <ContractAnalyzer />
          </div>

          {/* Right: AI Chat */}
          <div>
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
}