import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import ensoPools from './data/enso-defi-tokens.json';
import { getAddress } from 'viem';

const prisma = new PrismaClient();

/*
    id             String @id @default(cuid())
    name           String
    receiptTokenId String

    defillamaId String?
    symbol      String
    createdAt   DateTime @default(now())

    chainId    Int
    chain      Chain    @relation(fields: [chainId], references: [id])
    protocolId String
    protocol   Protocol @relation(fields: [protocolId], references: [id])

    isStablecoin Boolean @default(false)
    poolMeta     String?

    underlyingTokens String[]

    updatedAt DateTime @updatedAt
*/

async function main() {
  console.log('Starting pools seed...');

  const pools = ensoPools.data.map((pool) => ({
    name: pool.name,
    symbol: pool.symbol,
    chainId: 146,
    protocolId: pool.protocolSlug,
    receiptTokenId: getAddress(pool.primaryAddress),
    underlyingTokens: pool.underlyingTokens.map((token) => getAddress(token.address)),
    protocolSlug: pool.protocolSlug,
  }));

  for (const { protocolSlug, ...pool } of pools) {
    const protocol = await prisma.protocol.findUnique({
      where: {
        ensoId: protocolSlug,
      },
    });

    if (!protocol) {
      console.error(`Protocol ${protocolSlug} not found`);
      continue;
    }
    
    
    await prisma.pool.create({
      data: {
        ...pool,
        protocolId: protocol.id,
      },
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
