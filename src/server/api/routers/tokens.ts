import { getTokenRisks } from "@nuvolari/agents/core/_resolvers/token-risks";
import { publicProcedure } from "../trpc";
import { createTRPCRouter } from "../trpc";
import { z } from "zod";
import { addressSchema } from "@nuvolari/agents/tools/common";
import { calculateAccountPortfolio } from "./_resolvers/calculate-account-portfolio";
import { getAddress } from "viem";
import { transformTokensToPartialInsights } from "./_resolvers/tokens-to-insight";
import { InsightType } from "@prisma/client";


const getTokensRiskInput = z.object({
  address: addressSchema,
  minRiskScore: z.number(),
  maxRiskScore: z.number(),
});


const getComputedTokenInsightInput = z.object({
  address: addressSchema,
  tokenIn: addressSchema,
  tokenOut: addressSchema,
});


export const tokensRouter = createTRPCRouter({
  getTokensByPortfolioAndRisk: publicProcedure.input(getTokensRiskInput).query(async ({ ctx, input }) => {
     const tokens = await getTokenRisks(ctx.db, input.minRiskScore, input.maxRiskScore);

     const portfolio = await calculateAccountPortfolio(ctx.plugins.enso, ctx.db, input.address);

     const tokensWithBalance = tokens.map(token => {
      const tokenBalance = portfolio.tokens.find(t => getAddress(t.tokenMetadata.id) === getAddress(token.id));

      if (!tokenBalance) {
        return null;
      }

      return {
        ...token,
        ...tokenBalance,
      };
     });
     
     return tokensWithBalance.filter(Boolean);
  }),


  getComputedTokenInsight: publicProcedure.input(getComputedTokenInsightInput).query(async ({ ctx, input }) => {
    const tokenIn = await ctx.db.token.findUnique({ where: { id: input.tokenIn } });
    if (!tokenIn) throw new Error(`Token not found: ${input.tokenIn}`);

    const tokenOut = await ctx.db.token.findUnique({ where: { id: input.tokenOut }, include: { risks: true } });
    if (!tokenOut) throw new Error(`Token not found: ${input.tokenOut}`);

    const tokenOutWithRisk = {
      ...tokenOut,
      riskScore: tokenOut.risks[0]?.riskScore ?? 0,
    };

    return transformTokensToPartialInsights(tokenIn, tokenOutWithRisk, InsightType.TOKEN_OPPORTUNITY);
  }),
});