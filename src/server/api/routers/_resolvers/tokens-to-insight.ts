import { TokenWithRiskScore } from '@nuvolari/agents/interfaces/resolver-types';
import { InsightType, Insight, Prisma, Token } from '@prisma/client';

// Define a type with token included for stronger typing
type InsightWithToken = Insight & {
  tokenOut: TokenWithRiskScore;
}


/**
 * Transforms an array of TokenWithRiskScore objects into Partial<Insight> objects
 * for TOKEN_OPPORTUNITY type insights
 * 
 * @param tokens Array of tokens with risk scores to transform
 * @param tokenIn The input token for the opportunity
 * @param insightType The InsightType to apply to all insights (should be TOKEN_OPPORTUNITY)
 * @returns Array of Partial<Insight> objects
 */
export const transformTokensToPartialInsights = (
  tokenIn: Token,
  tokenOut: TokenWithRiskScore,
  insightType: InsightType
): Partial<InsightWithToken> => {
  // Validate insight type
  if (insightType !== 'TOKEN_OPPORTUNITY') {
    throw new Error(`Unsupported insight type: ${insightType}`);
  }

  // Create a standardized API call format for token swaps
  const apiCall = `/api/execute/swap?tokenInId=${tokenIn.id}&tokenOutId=${tokenOut.id}`;
  
    // Create the partial insight object with token opportunity specifics
    const partialInsight: Omit<InsightWithToken, 'tokenInAmount' | 'tokenIn' | 'userAddress' | 'executionTxHash' | 'executionDate'> = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
      type: insightType,
      protocolSlug: 'Nuvolari', // Or derive from a specific protocol if applicable
      apiCall,
      status: 'PENDING',
      tokenInId: tokenIn.id,
      tokenInDecimals: tokenIn.decimals,
      tokenOutId: tokenOut.id,
      tokenOut: tokenOut, // Include full tokenOut from DB
      poolOutId: null, // This is a TOKEN_OPPORTUNITY, not a YIELD_POOL
      insightShort: `Swap ${tokenIn.symbol} for ${tokenOut.symbol}`,
      insightDetailed: `Exchange your ${tokenIn.symbol} for ${tokenOut.symbol}.${tokenOut.riskScore > 0 ? ` This token has a risk score of ${tokenOut.riskScore.toFixed(2)}.` : ''}`,
    };
    
  return partialInsight;
};