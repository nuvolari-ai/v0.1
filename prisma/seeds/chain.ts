
import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting chains seed...');

  await prisma.chain.deleteMany();

  await prisma.chain.create({
    data: {
      id: 146,
      name: 'Sonic',
      geckoId: 'sonic-3',
      defillamaId: 'sonic',
    },
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
