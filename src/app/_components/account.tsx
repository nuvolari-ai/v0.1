'use client';
import { useAccount } from 'wagmi';
import { api } from '@nuvolari/trpc/react';
import { useEffect } from 'react';
import { TestInsight } from './test-insights';



export const Account = () => {
  const { address } = useAccount();

  const { data: account } = api.account.getNuvolariAccount.useQuery({
    address: address ?? '',
  }, {
    enabled: !!address,
  });

  const { mutate: invokeNuvolari } = api.llm.invokeNuvolari.useMutation();

  const { data: pendingInsights } = api.insight.getPendingInsights.useQuery({
    address: address ?? '',
  }, {
    enabled: !!address,
  });

  useEffect(() => {
    if (account) {
      invokeNuvolari({
        address: address ?? '',
      });
    }
  }, [account]);



  return (
    <div>
      <p style={{ color: 'white' }}>Address: {address}</p>
      <p style={{ color: 'white' }}>Tokens: {account?.tokens.length}</p>
      <p style={{ color: 'white' }}>Positions: {account?.positions.length}</p>
      <p style={{ color: 'white' }}>Total: {account?.total.toFixed(2)}$</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {pendingInsights?.map((insight) => (
          <TestInsight key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}