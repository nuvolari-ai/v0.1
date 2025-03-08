'use client';

import { useAccount } from 'wagmi';
import { api } from '@nuvolari/trpc/react';
import { useEffect } from 'react';
export const Account = () => {
  const { address } = useAccount();

  const { data: account } = api.account.getNuvolariAccount.useQuery({
    address: address ?? '',
  }, {
    enabled: !!address,
  });

  useEffect(() => {
    if (account) {
      console.log(JSON.stringify(account));
    }
  }, [account]);


  return (
    <div>
      <p style={{ color: 'white' }}>Address: {address}</p>
      <p style={{ color: 'white' }}>Tokens: {account?.tokens.length}</p>
      <p style={{ color: 'white' }}>Positions: {account?.positions.length}</p>
      <p style={{ color: 'white' }}>Total: {account?.total.toFixed(2)}$</p>

      {account?.tokens.map((token) => (
        <p 
            style={{ color: 'white' }} 
            key={token.tokenMetadata.id}>{token.tokenMetadata.name} - {token.amount} {token.tokenMetadata.symbol} - {token.usdValue.toFixed(2)}$
        </p>
      ))}

      {account?.positions.map((position) => (
        <p 
            style={{ color: 'white' }} 
            key={position.poolMetadata.id}>
                {position.poolMetadata.name} - {position.amount} {position.poolMetadata.symbol} - {position.usdValue.toFixed(2)}$
            </p>
      ))}
      <p style={{ color: 'white' }}>Portfolio Risk Score: {account?.portfolioRiskScore.toFixed(2)}</p>
      <p style={{ color: 'white' }}>Portfolio Risk Grade: {account?.riskGrade}</p>
    </div>
  );
}