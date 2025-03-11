import 'dotenv/config';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const symbolToGeckoId: Record<string, string> = {
    'USDCE': 'sonic-bridged-usdc-e-sonic',
    'S': 'sonic-3',
    'SOLVBTC': 'solv-btc',
    'SOLVBTC.BBN': 'solv-protocol-solvbtc-bbn',
    'PENDLE': 'pendle',
    'FRXUSD': 'frax-usd',
    'ANON': 'heyanon',
    'EGGS': 'eggs-finance',
    'OS': 'origin-staked-s',
    'WAGMI': 'wagmi-2',
    'SHADOW': 'shadow-2',
    'WOS': 'wrapped-origin-sonic',
    'SFRXUSD': 'staked-frax-usd',
    'BRUSH': 'paint-swap',
    'BEETS': 'beets',
    'GOGLZ': 'googles',
    'PAL': 'paladin',
    'SWPX': 'swapx-2',
    'METRO': 'metropolis',
    'FIVE': 'defive',
    'THC': 'tinhatcat',
    'EQUAL': 'equalizer-on-sonic',
    'NAVI': 'mummy-finance',
    'SCUSD': 'rings-scusd',
    'STS': 'beets-staked-sonic',
    'YEL': 'yel-finance',
    'INDI': 'indi',
    'ATETH': 'atoll-eth',
    'SNS': 'sonic-name-service',
    'FA': 'fate-adventure',
    'TOONA': 'toona',
    'YOKO': 'yoko',
    'MIM': 'magic-internet-money-meme-2',
    'LUMOS': 'lumoscoin',
    'HEDGY': 'hedgy-the-hedgehog',
    'WHALE': 'whale-ecosystem',
    'WOOF': 'muttski-2',
    'FROQ': 'froq',
    'LUDWIG': 'ludwig',
    'BRNX': 'burnx-2',
    'SPACE': 'space-token-bsc',
    'MOON': 'moon-bay-2',
    'ECO': 'fantom-eco-2',
    'TRIBE': 'tribe-3',
    'CONK': 'shibapoconk',
    'BCSPX': 'backed-cspx-core-s-p-500',
    'FSONIC': 'fantomsonicinu-2',
    'SPINDASH': 'spindash',
    'WETH': 'bridged-wrapped-ether-sonic',
    'TAILS': 'tails-2',
    'SCETH': 'rings-sc-eth',
    'JEFE': 'jefe',
    'AG': 'silver-2',
    'SONIC': 'sonic-4',
    'GSNAKE': 'gsnake',
    'SACRA': 'sacra',
    'GFI': 'gravity-finance-2',
    'DERP': 'derp-2',
    'WS': 'wrapped-sonic',
    'FS': 'fantomstarter',
    'PLUS': 'plus-bet'
  };
  

async function main() {
    console.log('Starting gecko id assignment...');

    const tokens = await prisma.token.findMany();

    for (const token of tokens) {
        console.log(`Assigning gecko id to ${token.name}`);

        const geckoId = symbolToGeckoId[token.symbol];

        if (!geckoId) {
            console.log(`No gecko id found for ${token.name}`);
            continue;
        }

        if (geckoId) {
            await prisma.token.update({
                where: { id: token.id },
                data: { coingeckoId: geckoId },
            });
        }
    }

    console.log('Gecko id assignment completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });