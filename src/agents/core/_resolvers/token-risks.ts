import { Token } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TokenWithRiskScore } from "@nuvolari/agents/interfaces/resolver-types";

export async function getTokenRisks(db: PrismaClient, minRiskScore: number, maxRiskScore: number): Promise<TokenWithRiskScore[]> {
  const tokens = await db.token.findMany({
    include: {
        risks: true
    },
    where: {
      risks: {
        some: {
          riskScore: {
            gte: minRiskScore,
            lte: maxRiskScore
          }
        }
      }
    }
  });

  return tokens.map(token => ({
    ...token,
    riskScore: token.risks[0]?.riskScore ?? 0
  }));
}