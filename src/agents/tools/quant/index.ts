import { tool } from "@langchain/core/tools";
import { getPoolsByRiskParameters } from "./parameters";
import { getPoolsByRiskScoreRange } from "@nuvolari/agents/core/_resolvers/pool-risks";
import { db } from "@nuvolari/server/db";
import { formatPoolsToCSV, formatTokensToCSV } from "@nuvolari/agents/utils/format";
import { getTokenRisks } from "@nuvolari/agents/core/_resolvers/token-risks";

/**
 * Get pools and tokens by risk score range
 */
export const getOpportunitiesByRiskTool = tool(
  async ({ minRiskScore, maxRiskScore }) => {
    const pools = await getPoolsByRiskScoreRange(db, {
      minRiskScore,
      maxRiskScore,
      chainId: 146,
    });

    const tokens = await getTokenRisks(db, minRiskScore, maxRiskScore);
    
    // Tools must return strings
    return formatPoolsToCSV(pools) + "\n" + formatTokensToCSV(tokens);
  },
  {
    name: "get_opportunities_by_risk",
    description: "Get pools and tokens by precomputed risk level of the user",
    schema: getPoolsByRiskParameters,
  }
);
