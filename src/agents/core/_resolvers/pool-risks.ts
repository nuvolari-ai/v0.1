import { PrismaClient, Prisma } from '@prisma/client';

// Input parameters for getPoolsByRiskScoreRange
export interface GetPoolsByRiskScoreRangeParams {
  minRiskScore: number;
  maxRiskScore: number;
  chainId?: number;
  limit?: number;
  offset?: number;
}

// Define the type for a pool with protocol and calculated risk score
type PoolWithProtocol = Prisma.PoolGetPayload<{
  include: {
    protocol: {
      include: {
        risks: true;
      }
    }
  }
}>;

export interface PoolWithRiskScore extends PoolWithProtocol {
  combinedRiskScore: number;
}

/**
 * Calculate combined risk score for a pool based on protocol and underlying tokens
 */
async function calculatePoolRiskScore(
  db: PrismaClient, 
  pool: PoolWithProtocol
): Promise<number> {
  // Get protocol risk (weight: 60%)
  const protocolRiskWeight = 0.6;
  const protocolRisk = pool.protocol?.risks?.length > 0 
    ? pool.protocol.risks[0]?.finalPRF ?? 2.5
    : 2.5; // Default medium risk if no data
  
  // Get underlying token risks (weight: 40%)
  const tokenRiskWeight = 0.4;
  let tokenRiskScore = 2.5; // Default medium risk
  
  if (pool.underlyingTokens && pool.underlyingTokens.length > 0) {
    // Fetch risk scores for all underlying tokens
    const tokenRisks = await db.tokenRisk.findMany({
      where: {
        tokenId: {
          in: pool.underlyingTokens
        }
      }
    });
    
    if (tokenRisks.length > 0) {
      // Calculate average token risk score
      tokenRiskScore = tokenRisks.reduce((sum, token) => sum + token.riskScore, 0) / tokenRisks.length;
    }
  }
  
  // Calculate combined risk score
  const combinedRiskScore = (protocolRisk * protocolRiskWeight) + (tokenRiskScore * tokenRiskWeight);
  
  return parseFloat(combinedRiskScore.toFixed(2));
}

/**
 * Gets pools that match a specific risk score range
 */
export async function getPoolsByRiskScoreRange(
  db: PrismaClient,
  params: GetPoolsByRiskScoreRangeParams
): Promise<PoolWithRiskScore[]> {
  const { minRiskScore, maxRiskScore, chainId, limit = 50, offset = 0 } = params;
  
  // First, get all pools with their protocol risks and underlying tokens
  const whereClause: Prisma.PoolWhereInput = {};
  
  // Add chainId filter if provided
  if (chainId !== undefined) {
    whereClause.chainId = chainId;
  }
  
  // Query all pools (we'll filter by risk later)
  const allPools = await db.pool.findMany({
    where: whereClause,
    include: {
      protocol: {
        include: {
          risks: true
        }
      }
    }
  });
  
  // Calculate combined risk score for each pool
  const poolsWithRiskScores = await Promise.all(
    allPools.map(async (pool) => {
      const combinedRiskScore = await calculatePoolRiskScore(db, pool);
      return {
        ...pool,
        combinedRiskScore
      };
    })
  );
  
  // Filter pools by the calculated risk score
  const filteredPools = poolsWithRiskScores.filter(pool => 
    pool.combinedRiskScore >= minRiskScore && pool.combinedRiskScore <= maxRiskScore
  );
  
  // Sort by risk score (ascending)
  const sortedPools = filteredPools.sort((a, b) => a.combinedRiskScore - b.combinedRiskScore);
  
  // Apply pagination
  const paginatedPools = sortedPools.slice(offset, offset + limit);
  
  return paginatedPools;
}

/**
 * Gets the risk score for a specific pool
 */
export async function getPoolRiskScore(
  db: PrismaClient,
  poolId: string
): Promise<{ 
  poolId: string; 
  riskScore: number; 
  grade: string;
  components: {
    protocolRisk?: number;
    protocolGrade?: string;
    tokenRisk?: number;
  }
}> {
  const pool = await db.pool.findUnique({
    where: {
      id: poolId
    },
    include: {
      protocol: {
        include: {
          risks: true
        }
      }
    }
  });
  
  if (!pool) {
    throw new Error('Pool not found');
  }
  
  const riskScore = await calculatePoolRiskScore(db, pool);
  
  // Determine grade based on risk score
  const grade = riskScore <= 1.8 ? 'A' :
                riskScore <= 2.4 ? 'B' :
                riskScore <= 3.0 ? 'C' :
                riskScore <= 3.6 ? 'D' : 'E';
  
  // Get protocol risk components
  const protocolRisk = pool.protocol?.risks?.length > 0
    ? pool.protocol.risks[0]?.finalPRF
    : 2.5;
    
  const protocolGrade = pool.protocol?.risks?.length > 0
    ? pool.protocol.risks[0]?.grade
    : 'C';
  
  // Get token risk components (optional)
  let tokenRisk: number | undefined;
  
  if (pool.underlyingTokens && pool.underlyingTokens.length > 0) {
    const tokenRisks = await db.tokenRisk.findMany({
      where: {
        tokenId: {
          in: pool.underlyingTokens
        }
      }
    });
    
    if (tokenRisks.length > 0) {
      tokenRisk = tokenRisks.reduce((sum, token) => sum + token.riskScore, 0) / tokenRisks.length;
    }
  }
  
  return {
    poolId: pool.id,
    riskScore,
    grade,
    components: {
      protocolRisk,
      protocolGrade,
      tokenRisk
    }
  };
}

/**
 * Helper function to get pools by risk grade
 */
export async function getPoolsByRiskGrade(
  db: PrismaClient,
  params: {
    grade: 'A' | 'B' | 'C' | 'D' | 'E';
    chainId?: number;
    limit?: number;
    offset?: number;
  }
): Promise<PoolWithRiskScore[]> {
  // Map grades to risk score ranges
  const gradeRanges = {
    'A': { min: 0, max: 1.8 },
    'B': { min: 1.8, max: 2.4 },
    'C': { min: 2.4, max: 3.0 },
    'D': { min: 3.0, max: 3.6 },
    'E': { min: 3.6, max: 5.0 }
  };
  
  const range = gradeRanges[params.grade];
  
  return getPoolsByRiskScoreRange(db, {
    minRiskScore: range.min,
    maxRiskScore: range.max,
    chainId: params.chainId,
    limit: params.limit,
    offset: params.offset
  });
}