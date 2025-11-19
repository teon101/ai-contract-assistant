import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Smart Contract AI Assistant',
  projectId: '47ea8ace9746fbcb9f3a99b632c60450', // We'll get this in a moment
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});