import { addressSchema } from "@nuvolari/agents/tools/common";
import { generateInsights, parseInsights } from "@nuvolari/agents/workflows/on-chain-insights";
import { createTRPCRouter, publicProcedure } from "@nuvolari/server/api/trpc";
import { z } from "zod";
import { calculateAccountPortfolio } from "./_resolvers/calculate-account-portfolio";

const invokeNuvolariInput = z.object({
    address: addressSchema,
});

const testMinRiskScore = 1;
const testMaxRiskScore = 3;

export const llmRouter = createTRPCRouter({
    invokeNuvolari: publicProcedure.input(invokeNuvolariInput).mutation(async ({ ctx, input }) => {
        const {
            agent,
            plugins,
            db
        } = ctx;
        const portfolio = await calculateAccountPortfolio(plugins.enso, db, input.address);
        const insightsCSV = await generateInsights(
            agent, 
            portfolio,
            testMinRiskScore,
            testMaxRiskScore
        );
        const insights = parseInsights(insightsCSV);
        return insights;
    }),
});
