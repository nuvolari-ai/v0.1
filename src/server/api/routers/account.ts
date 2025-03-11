import { createTRPCRouter, publicProcedure } from "@nuvolari/server/api/trpc";
import { z } from "zod";
import { calculateAccountPortfolio } from "@nuvolari/server/api/routers/_resolvers/calculate-account-portfolio";
import { calculateAccountMood } from "./_resolvers/calculate-account-score";

const getNuvolariAccountSchema = z.object({
  address: z.string(),
});

export const accountRouter = createTRPCRouter({
  getNuvolariAccount: publicProcedure
    .input(getNuvolariAccountSchema)
    .query(async ({ ctx, input }) => {
      const portfolio = await calculateAccountPortfolio(
        ctx.plugins.enso,
        ctx.db,
        input.address
      );
      return portfolio;
    }),
  getNuvolariScore: publicProcedure
    .input(getNuvolariAccountSchema)
    .query(async ({ ctx, input }) => {
      const portfolio = await calculateAccountMood(
        ctx.plugins.octav,
        input.address
      );
      return portfolio;
    }),
});
