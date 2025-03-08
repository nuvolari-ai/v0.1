import { createTRPCRouter, publicProcedure } from "@nuvolari/server/api/trpc";
import { z } from "zod";
import { calculateAccountPortfolio } from "@nuvolari/server/api/routers/_resolvers/calculate-account-portfolio";

const getNuvolariAccountSchema = z.object({
    address: z.string(),
});

export const accountRouter = createTRPCRouter({
    getNuvolariAccount: publicProcedure.input(getNuvolariAccountSchema).query(async ({ ctx, input }) => {
        const portfolio = await calculateAccountPortfolio(ctx.plugins.enso, ctx.db, input.address);
        return portfolio;
    }),
});
