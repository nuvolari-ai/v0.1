import { z } from "zod";
import { createToolParameters } from "@goat-sdk/core"


export class GetPoolsByRiskParameters extends createToolParameters(z.object({
    minRiskScore: z.number(),
    maxRiskScore: z.number(),
})) {}







