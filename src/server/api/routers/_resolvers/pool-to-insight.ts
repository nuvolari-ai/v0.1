import { InsightType, Insight, Prisma, Token } from '@prisma/client';
import { PoolWithRiskScore } from '@nuvolari/agents/interfaces/resolver-types';


type InsightWithPool = Prisma.InsightGetPayload<{
  include: {
    poolOut: true;
  };
}>

/**
 * Transforms an array of PoolWithRiskScore objects into Partial<Insight> objects
 * excluding tokenInId, tokenInAmount, and tokenInDecimals properties
 * 
 * @param pools Array of pools with risk scores to transform
 * @param insightType The InsightType to apply to all insights
 * @returns Array of Partial<Insight> objects
 */
export const transformPoolsToPartialInsights = (
  pools: PoolWithRiskScore[],
  tokenIn: Token,
  insightType: InsightType
): Partial<InsightWithPool>[] => {
  if (!pools || pools.length === 0) {
    return [];
  }
  
  return pools.map((pool) => {
    // Extract the protocol information for creating insights
    const protocol = pool.protocol;
    
    // Create a standardized API call format - this is just an example
    // Adjust this based on your actual API call formatting requirements
    const apiCall = `/api/execute/deposit?poolId=${pool.id}&protocolId=${protocol.id}`;
    
    // Create the base partial insight object
    
    // Handle type-specific properties
    if (insightType !== 'YIELD_POOL') throw new Error(`Unsupported insight type: ${insightType}`);

    const partialInsight: Omit<InsightWithPool, 'tokenInAmount' | 'tokenIn' | 'userAddress' | 'executionTxHash' | 'executionDate'> = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
      type: insightType,
      protocolSlug: protocol.defillamaId || protocol.name.toLowerCase().replace(/\s+/g, '-'),
      apiCall,
      status: 'PENDING', // Setting default status to PENDING
      tokenInId: tokenIn.id,
      tokenInDecimals: tokenIn.decimals,
      poolOutId: pool.id,
      poolOut: pool,
      tokenOutId: pool.receiptTokenId,
      insightShort: `Deposit into ${pool.name} on ${protocol.name}`,
      insightDetailed: `Deposit funds into ${pool.name} on ${protocol.name} for an optimized yield opportunity. This pool has a risk score of ${pool.combinedRiskScore.toFixed(2)}.`,
    };
    
    return partialInsight;
  });
};