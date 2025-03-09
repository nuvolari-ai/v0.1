import { formatUnits, getAddress } from "viem";
import { type PrismaClient, type Prisma } from "@prisma/client";
import { type EnsoAPIClient } from "@nuvolari/agents/tools/enso/api";



type TokenWithRisk = Prisma.TokenGetPayload<{
    include: {
        risks: true,
    }
}>

type PoolWithProtocol = Prisma.PoolGetPayload<{
    include: {
        protocol: {
            include: {
                risks: true,
            }
        }
    }
}>
  
  
  interface TokenBalance {
    tokenMetadata: TokenWithRisk;
    amount: string;
    rawAmount: string;
    decimals: number;
    price: number;
    usdValue: number;
    percentage: number;
    riskScore: number;
  }
  
  interface PositionBalance {
    poolMetadata: PoolWithProtocol;
    amount: string;
    rawAmount: string;
    decimals: number;
    price: number;
    usdValue: number;
    percentage: number;
    riskScore: number;
  }
  
export interface PortfolioSummary {
    tokens: TokenBalance[];
    positions: PositionBalance[];
    total: number;
    portfolioRiskScore: number;
    riskGrade: string;
  }
  
  /**
   * Calculates the portfolio details including token values, positions,
   * percentages, and risk scores
   */
  export async function calculateAccountPortfolio(
    enso: EnsoAPIClient,
    db: PrismaClient,
    address: string
  ): Promise<PortfolioSummary> {
  
    // Get the chain
    const { id: chainId } = await db.chain.findUniqueOrThrow({
      where: {
        id: 146,
      },
    });
  
    // Get wallet balances from Enso
    const ensoWallet = await enso.getWalletBalances({
      chainId,
      eoaAddress: address,
      useEoa: true,
    });
  
    // Get tokens and pools from DB
    const dbTokens = await db.token.findMany({
      include: {
        risks: true,
      },
    });
  
    const dbPools = await db.pool.findMany({
      include: {
        protocol: {
          include: {
            risks: true,
          },
        },
      },
    });
  
    // Create lookup maps
    const dbTokensByAddress = dbTokens.reduce((acc, token) => {
      acc[getAddress(token.id)] = token;
      return acc;
    }, {} as Record<string, TokenWithRisk>);
  
    const dbPoolsByReceiptTokenId = dbPools.reduce((acc, pool) => {
      acc[getAddress(pool.receiptTokenId)] = pool;
      return acc;
    }, {} as Record<string, PoolWithProtocol>);
  
   // Process tokens
  const tokens = ensoWallet
  .map(({ token, amount, decimals, price }) => {
    const address = enso.safeAddress(token);
    const tokenMetadata = dbTokensByAddress[address];
    if (!tokenMetadata) {
      return null;
    }
    const formattedAmount = formatUnits(BigInt(amount), decimals);
    const usdValue = parseFloat(price) * parseFloat(formattedAmount);
    
    // Token risk is either from the DB or a fallback value
    const riskScore = tokenMetadata.risks && tokenMetadata.risks.length > 0 
      ? tokenMetadata.risks[0]?.riskScore ?? 2.5
      : 2.5;

    return {
      tokenMetadata,
      amount: formattedAmount,
      rawAmount: amount,
      decimals,
      price: parseFloat(price),
      usdValue,
      percentage: 0, // Will be calculated later
      riskScore,
    };
  })
  .filter((token): token is TokenBalance => token !== null);

// Process positions
  const positions = ensoWallet
  .map(({ token, amount, decimals, price }) => {
    const address = enso.safeAddress(token);
    const poolMetadata = dbPoolsByReceiptTokenId[address];
    if (!poolMetadata) {
      return null;
    }
    const formattedAmount = formatUnits(BigInt(amount), decimals);
    const usdValue = parseFloat(price) * parseFloat(formattedAmount);
    
    // Protocol risk is from the protocol's finalPRF or a fallback
    const riskScore = poolMetadata.protocol?.risks[0]?.finalPRF ?? 2.5;

    return {
      poolMetadata,
      amount: formattedAmount,
      rawAmount: amount,
      decimals,
      price: parseFloat(price),
      usdValue,
      percentage: 0, // Will be calculated later
      riskScore,
    };
  })
  .filter((position): position is PositionBalance => position !== null);

// Calculate total value
const total = 
  tokens.reduce((acc, token) => acc + token.usdValue, 0) +
  positions.reduce((acc, position) => acc + position.usdValue, 0);

// Handle the case where total might be 0 (empty portfolio)
if (total > 0) {
  // Calculate percentages
  tokens.forEach(token => {
    token.percentage = parseFloat(((token.usdValue / total) * 100).toFixed(2));
  });

  positions.forEach(position => {
    position.percentage = parseFloat(((position.usdValue / total) * 100).toFixed(2));
  });
} else {
  // Set all percentages to 0 if total is 0
  tokens.forEach(token => { token.percentage = 0; });
  positions.forEach(position => { position.percentage = 0; });
}

// Calculate weighted portfolio risk score
let weightedRiskSum = 0;
let portfolioRiskScore = 2.5; // Default value if portfolio is empty

if (total > 0) {
  tokens.forEach(token => {
    weightedRiskSum += token.riskScore * (token.usdValue / total);
  });

  positions.forEach(position => {
    weightedRiskSum += position.riskScore * (position.usdValue / total);
  });

  portfolioRiskScore = parseFloat(weightedRiskSum.toFixed(2));
}

// Determine risk grade based on score (similar to how protocol risk grades work)
let riskGrade = "Unknown";
if (portfolioRiskScore <= 1.8) {
  riskGrade = "A";
} else if (portfolioRiskScore <= 2.4) {
  riskGrade = "B";
} else if (portfolioRiskScore <= 3.0) {
  riskGrade = "C";
} else if (portfolioRiskScore <= 3.6) {
  riskGrade = "D";
} else {
  riskGrade = "E";
}

return {
  tokens,
  positions,
  total,
  portfolioRiskScore,
  riskGrade,
};
}