import { PrismaClient, InsightStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Marks all PENDING insights as STALE
 * This is used to ensure that insights don't stay in the PENDING state indefinitely
 */
export async function markPendingInsightsAsStale() {
  try {
    // Get current time for logging
    const now = new Date();
    console.log(`[${now.toISOString()}] Running job to mark pending insights as stale`);
    
    // Update all PENDING insights to STALE status
    const result = await prisma.insight.updateMany({
      where: {
        status: InsightStatus.PENDING,
      },
      data: {
        status: InsightStatus.STALE,
      },
    });
    
    console.log(`[${now.toISOString()}] Marked ${result.count} insights as STALE`);
    
    return {
      success: true,
      updatedCount: result.count,
    };
  } catch (error) {
    console.error('Error marking insights as stale:', error);
    throw error;
  }
}