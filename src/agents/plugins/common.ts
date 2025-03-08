import { z } from "zod";

export const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/);

export const riskScoreSchema = z.number().min(0).max(5);
export const riskGradeSchema = z.enum(["A", "B", "C", "D", "E"]);
export const riskLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
