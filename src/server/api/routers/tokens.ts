import { getTokenRisks } from "@nuvolari/agents/core/_resolvers/token-risks";
import { publicProcedure } from "../trpc";
import { createTRPCRouter } from "../trpc";
import { z } from "zod";
import { addressSchema } from "@nuvolari/agents/tools/common";
import { calculateAccountPortfolio } from "./_resolvers/calculate-account-portfolio";
import { getAddress } from "viem";


const getTokensRiskInput = z.object({
  address: addressSchema,
  minRiskScore: z.number(),
  maxRiskScore: z.number(),
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
});