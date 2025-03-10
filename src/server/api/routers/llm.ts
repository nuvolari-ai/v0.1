import { addressSchema } from "@nuvolari/agents/tools/common";
import { generateAndIndexInsights, parseInsights } from "@nuvolari/agents/workflows/on-chain-insights";
import { createTRPCRouter, publicProcedure } from "@nuvolari/server/api/trpc";
import { z } from "zod";
import { calculateAccountPortfolio } from "./_resolvers/calculate-account-portfolio";
import { hasPendingInsights } from "./_resolvers/insights";
import { TRPCError } from "@trpc/server";

const invokeNuvolariInput = z.object({
    address: addressSchema,
    minRiskScore: z.number().min(1).max(5).default(1),
    maxRiskScore: z.number().min(1).max(5).default(3),
    forceGenerate: z.boolean().default(false),
});

export const llmRouter = createTRPCRouter({
    invokeNuvolari: publicProcedure.input(invokeNuvolariInput).mutation(async ({ ctx, input }) => {
        const {
            agent,
            plugins,
            db
        } = ctx;
        
        // Check for pending insights unless forceGenerate is true
        if (!input.forceGenerate) {
            const pendingCheck = await hasPendingInsights(input.address);
            
            if (pendingCheck.hasPending) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: `User already has ${pendingCheck.count} pending insights. Use forceGenerate=true to override.`,
                });
            }
        }
        
        // If no pending insights or forceGenerate is true, proceed with generation
        const portfolio = await calculateAccountPortfolio(plugins.enso, db, input.address);
        const insights = await generateAndIndexInsights(
            agent, 
            portfolio,
            input.address,
            input.minRiskScore,
            input.maxRiskScore
        );
        
        return insights;
    }),
});
