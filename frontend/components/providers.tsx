'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';

import '@rainbow-me/rainbowkit/styles.css';

interface ContractData {
  address: string;
  name: string;
  abi: any[];
  analysis: string;
  isVerified: boolean;
  balance: string;
  compiler: string;
}

interface AppContextType {
  currentContract: ContractData | null;
  setCurrentContract: (contract: ContractData | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  const [currentContract, setCurrentContract] = useState<ContractData | null>(null);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#06b6d4',
          accentColorForeground: 'white',
          borderRadius: 'large',
        })}>
          <AppContext.Provider value={{ currentContract, setCurrentContract }}>
            {children}
          </AppContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within Providers');
  }
  return context;
}