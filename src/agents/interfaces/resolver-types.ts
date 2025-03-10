import { Prisma, Token } from '@prisma/client';

/**
 * Input parameters for getPoolsByRiskScoreRange
 */
export interface GetPoolsByRiskScoreRangeParams {
  minRiskScore: number;
  maxRiskScore: number;
  chainId?: number;
  limit?: number;
  offset?: number;
}

/**
 * Type for a pool with protocol and included risk data
 */
export type PoolWithProtocol = Prisma.PoolGetPayload<{
  include: {
    protocol: {
      include: {
        risks: true;
      }
    }
  }
}>;

/**
 * Extended pool with calculated risk score
 */
export interface PoolWithRiskScore extends PoolWithProtocol {
  combinedRiskScore: number;
}



type TokenWithRisk = Prisma.TokenGetPayload<{
  include: {
    risks: true;
  }
}>


export interface TokenBalance {
  tokenMetadata: TokenWithRisk;
  amount: string;
  rawAmount: string;
  decimals: number;
  price: number;
  usdValue: number;
  percentage: number;
  riskScore: number;
}

export interface PositionBalance {
  poolMetadata: PoolWithProtocol;
  amount: string;
  rawAmount: string;
  decimals: number;
  price: number;
  usdValue: number;
  percentage: number;
  riskScore: number;
}

/**
 * Portfolio summary containing token and position balances
 */
export interface PortfolioSummary {
  tokens: TokenBalance[];
  positions: PositionBalance[];
  total: number;
  portfolioRiskScore: number;
  riskGrade: string;
  userAddress: string;
} 

export type TokenWithRiskScore = Token & {
  riskScore: number;
};