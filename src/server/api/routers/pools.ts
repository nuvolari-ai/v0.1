import { publicProcedure } from "../trpc";
import { z } from "zod";
import { addressSchema } from "@nuvolari/agents/tools/common";
import { createTRPCRouter } from "../trpc";
import { getPoolsByRiskScoreRange } from "@nuvolari/agents/core/_resolvers/pool-risks";
import { transformPoolsToPartialInsights } from "./_resolvers/pool-to-insight";
import { InsightType } from "@prisma/client";


const getPoolsByRisksInput = z.object({
  address: addressSchema,
  tokenIn: addressSchema,
  minRiskScore: z.number(),
  maxRiskScore: z.number(),
});

export const poolsRouter = createTRPCRouter({
  getComputedPoolInsights: publicProcedure.input(getPoolsByRisksInput).query(async ({ ctx, input }) => {
    const pools = await getPoolsByRiskScoreRange(ctx.db, {
      minRiskScore: input.minRiskScore,
      maxRiskScore: input.maxRiskScore,
      chainId: 146,
    });

    const tokenIn = await ctx.db.token.findUnique({ where: { id: input.tokenIn } });
    if (!tokenIn) {
      throw new Error(`Token not found: ${input.tokenIn}`);
    }
    return transformPoolsToPartialInsights(pools, tokenIn, InsightType.YIELD_POOL);
  }),
});
