import { sonic } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set');
}

export const wagmiConfig = getDefaultConfig({
  appName: 'NuvolariAI',
  projectId,
  chains: [sonic],
  ssr: true
});