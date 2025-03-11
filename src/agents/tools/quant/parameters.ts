import { z } from "zod";


export const getPoolsByRiskParameters = z.object({
    minRiskScore: z.number(),
    maxRiskScore: z.number(),
})

