import {
  ConnectButton,
} from '@rainbow-me/rainbowkit';
import { Account } from './_components/account';
import { HydrateClient } from '@nuvolari/trpc/server';

export default async function Home() {
  return (
    <HydrateClient>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', height: '100vh', width: '100%' }}>
        <Account />
        <ConnectButton />
      </div>
    </HydrateClient>
  );
}
