import { PrismaClient, InsightType, InsightStatus } from '@prisma/client';
import { RawInsight } from '@nuvolari/agents/interfaces/workflow-types';

const prisma = new PrismaClient();

/**
 * Transforms an array of RawInsights into the DB format
 * @param rawInsights Array of RawInsight objects
 * @param userAddress User's blockchain address
 * @returns Array of objects ready to be inserted into the Insight model
 */
export const transformRawInsightsToDbFormat = async (
  rawInsights: RawInsight[],
  userAddress: string
) => {
  // Map each raw insight to the DB format
  const transformedInsights = await Promise.all(
    rawInsights.map(async (insight) => {
      // Find the token based on the tokenIn address
      const tokenIn = await prisma.token.findUnique({
        where: { id: insight.tokenIn },
      });

      if (!tokenIn) {
        throw new Error(`Token with ID ${insight.tokenIn} not found`);
      }

      // Find the protocol based on the ensoId (protocolSlug)
      const protocol = await prisma.protocol.findUnique({
        where: { ensoId: insight.protocolSlug },
      });

      if (!protocol) {
        throw new Error(`Protocol with ensoId ${insight.protocolSlug} not found`);
      }

      // Base insight data common to both types
      const baseInsightData = {
        type: insight.insightType as InsightType,
        userAddress,
        insightShort: insight.insightShort,
        insightDetailed: insight.insightDetailed,
        protocolSlug: insight.protocolSlug,
        apiCall: insight.apiCall,
        tokenInId: tokenIn.id,
        tokenInAmount: insight.tokenInAmount,
        tokenInDecimals: insight.tokenInDecimals,
        status: InsightStatus.PENDING,
      };

      // Handle different insight types
      if (insight.insightType === 'YIELD_POOL') {
        // For YIELD_POOL, find the pool and set poolOutId
        const pool = await prisma.pool.findFirst({
          where: { receiptTokenId: insight.tokenOut },
        });

        if (!pool) {
          throw new Error(`Pool with receiptTokenId ${insight.tokenOut} not found`);
        }

        return {
          ...baseInsightData,
          poolOutId: pool.id,
          tokenOutId: null,
        };
      } else if (insight.insightType === 'TOKEN_OPPORTUNITY') {
        // For TOKEN_OPPORTUNITY, tokenOut is a Token ID
        const tokenOut = await prisma.token.findUnique({
          where: { id: insight.tokenOut },
        });

        if (!tokenOut) {
          throw new Error(`Token with ID ${insight.tokenOut} not found`);
        }

        return {
          ...baseInsightData,
          poolOutId: null,
          tokenOutId: tokenOut.id,
        };
      } else {
        throw new Error(`Unsupported insight type: ${insight.insightType}`);
      }
    })
  );

  return transformedInsights;
};

/**
 * Indexes an array of RawInsights into the DB
 * @param rawInsights Array of RawInsight objects
 * @param userAddress User's blockchain address
 * @returns Array of created Insight objects
 */
export const indexRawInsights = async (
  rawInsights: RawInsight[],
  userAddress: string
) => {
  try {
    const transformedInsights = await transformRawInsightsToDbFormat(rawInsights, userAddress);
    
    // Create all insights in a transaction
    const createdInsights = await prisma.$transaction(
      transformedInsights.map((insightData) => 
        prisma.insight.create({
          data: insightData,
        })
      )
    );
    
    return createdInsights;
  } catch (error) {
    console.error('Error indexing insights:', error);
    throw error;
  }
};

/**
 * Returns array of PENDING Insights from the DB
 * @param userAddress User's blockchain address
 * @returns Array of pending Insight objects
 */
export const getPendingInsights = async (userAddress: string) => {
  try {
    const pendingInsights = await prisma.insight.findMany({
      where: {
        userAddress,
        status: InsightStatus.PENDING,
      },
      include: {
        tokenIn: true,
        poolOut: {
          include: {
            protocol: true,
          },
        },
      },
    });
    
    return pendingInsights;
  } catch (error) {
    console.error('Error getting pending insights:', error);
    throw error;
  }
};

/**
 * Assigns EXECUTED status, executionDate and executionTxHash to an Insight
 * @param insightId ID of the Insight to update
 * @param executionTxHash Transaction hash of the execution
 * @param userAddress User's blockchain address for security check
 * @returns Updated Insight object
 */
export const markInsightAsExecuted = async (
  insightId: string,
  executionTxHash: string,
  userAddress: string
) => {
  try {
    const updatedInsight = await prisma.insight.update({
      where: {
        id: insightId,
        userAddress
      },
      data: {
        status: InsightStatus.EXECUTED,
        executionDate: new Date(),
        executionTxHash,
      },
    });
    
    return updatedInsight;
  } catch (error) {
    console.error('Error marking insight as executed:', error);
    throw error;
  }
};

/**
 * Checks if a user has any pending insights
 * @param userAddress User's blockchain address
 * @returns Boolean indicating if the user has pending insights and count of pending insights
 */
export async function hasPendingInsights(userAddress: string): Promise<{ hasPending: boolean; count: number }> {
  try {
    // Count the number of pending insights for the user
    const pendingCount = await prisma.insight.count({
      where: {
        userAddress,
        status: InsightStatus.PENDING,
      },
    });
    
    return {
      hasPending: pendingCount > 0,
      count: pendingCount,
    };
  } catch (error) {
    console.error('Error checking for pending insights:', error);
    throw error;
  }
}