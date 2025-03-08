import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import ensoProtocols from './data/enso-protocols.json';

const prisma = new PrismaClient();

/*
    id          String   @id @default(cuid())
    name        String
    defillamaId String?
    ensoId      String?  @unique
    logosUri    String[] @default([])

    chainId Int
    chain   Chain @relation(fields: [chainId], references: [id])

    createdAt DateTime       @default(now())
    updatedAt DateTime       @updatedAt
    risks     ProtocolRisk[]
    pools     Pool[]
*/
async function main() {
  console.log('Starting protocol seed...');

  const sonicProtocols = ensoProtocols
    .filter((protocol) => protocol.chains.some((chain) => chain.id === 146))
    .map((protocol) => ({
      name: protocol.name || '',
      ensoId: protocol.slug,
      logosUri: protocol.logosUri,
      chainId: 146,
    }));

  await prisma.protocol.deleteMany();
  await prisma.protocol.createMany({
    data: sonicProtocols,
  });

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