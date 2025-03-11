export type InsightType = "YIELD_POOL" | "TOKEN_OPPORTUNITY";

export interface RawInsight {
  tokenIn: string;
  tokenInAmount: string;
  tokenInDecimals: number;
  tokenOut: string;
  apiCall: string;
  insightShort: string;
  insightDetailed: string;
  protocolSlug: string;
  insightType: InsightType;
}