import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import ensoBaseTokens from './data/enso-base-tokens.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting token seed...');

  await prisma.tokenRisk.deleteMany();
  await prisma.token.deleteMany();
  
  // Token data from CoinGecko
  const tokens = ensoBaseTokens.data.map(({ chainId, address, type, ...token }) => ({
    ...token,
    id: address,
    chainId: 146,
  }));

  tokens.push({
    id: '0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38',
    chainId: 146,
    name: 'Wrapped Sonic',
    symbol: 'WS',
    decimals: 18,
    logosUri: ['https://assets.coingecko.com/coins/images/52857/standard/wrapped_sonic.png?1734536585'],
  })

  await prisma.token.createMany({
    data: tokens,
  });

  console.log(`Seed completed successfully. Inserted ${tokens.length} tokens with initial risk scores.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });