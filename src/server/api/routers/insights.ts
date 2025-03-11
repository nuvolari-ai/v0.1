import { addressSchema } from "@nuvolari/agents/tools/common";
import { createTRPCRouter, publicProcedure } from "@nuvolari/server/api/trpc";
import { z } from "zod";
import { getPendingInsights, markInsightAsExecuted } from "./_resolvers/insights";
import { generateAndIndexInsights } from "@nuvolari/agents/workflows/on-chain-insights";
import { calculateAccountPortfolio } from "./_resolvers/calculate-account-portfolio";

// Schema for the getPendingInsights input
const getPendingInsightsInput = z.object({
  address: addressSchema,
});

// Schema for the markInsightAsExecuted input
const markInsightAsExecutedInput = z.object({
  insightId: z.string(),
  executionTxHash: z.string(),
  userAddress: addressSchema,
});

export const insightRouter = createTRPCRouter({
  /**
   * Get all pending insights for a user
   */
  getPendingInsights: publicProcedure
    .input(getPendingInsightsInput)
    .query(async ({ input }) => {
      const pendingInsights = await getPendingInsights(input.address);
      return pendingInsights;
    }),

  /**
   * Mark an insight as executed with transaction hash
   */
  markInsightAsExecuted: publicProcedure
    .input(markInsightAsExecutedInput)
    .mutation(async ({ ctx, input }) => {
      const executedInsight = await markInsightAsExecuted(
        input.insightId,
        input.executionTxHash,
        input.userAddress
      );

      return executedInsight;
    }),
});