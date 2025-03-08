
import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/*
 stability
 stable-jack
 steer
 rings-wstkscusd
 rings-sc
 silo-v2-protected
 silo-v2
 rings
 origin-vaults
 rings-sc-staked-wrapped
 origin-wos
 pendle-markets
 rings-sc-staked
 beefy
 beets-sts
 pendle-sy
 euler-v2
 origin-os
 rings-scusd
 rings-stkscusd
 aave-v3
 wrapped-native
*/
const defillamaIds = {
    stability: 'stability',
    'stable-jack': 'stable-jack',
    steer: 'steer-protocol',
    'rings-wstkscusd': 'rings',
    'rings-sc': 'rings',
    'silo-v2-protected': 'silo-v2',
    'silo-v2': 'silo-v2',
    rings: 'rings',
    'origin-vaults': 'origin-protocol',
    'rings-sc-staked-wrapped': 'rings',
    'origin-wos': 'origin-sonic',
    'pendle-markets': 'pendle',
    'rings-sc-staked': 'rings',
    beefy: 'beefy',
    'beets-sts': 'beets',
    'pendle-sy': 'pendle',
    'euler-v2': 'euler-v2',
    'origin-os': 'origin-sonic',
    'rings-scusd': 'rings',
    'rings-stkscusd': 'rings',
    'aave-v3': 'aave-v3',
}


async function main() {
  console.log('Starting defillama id assignment...');

  const protocols = await prisma.protocol.findMany();

  for (const [key, value] of Object.entries(defillamaIds)) {
    const protocol = protocols.find((protocol) => protocol.ensoId === key);
    if (protocol) {
      await prisma.protocol.update({
        where: { id: protocol.id },
        data: { defillamaId: value },
      });
    }
  }

  console.log('Defillama id assignment completed successfully', protocols.length);
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
