import { tool } from "@langchain/core/tools";
import { getPoolsByRiskParameters } from "./parameters";
import { getPoolsByRiskScoreRange } from "@nuvolari/agents/core/_resolvers/pool-risks";
import { db } from "@nuvolari/server/db";
import { formatPoolsToCSV } from "@nuvolari/agents/utils/format";

/**
 * Get pools by risk score range
 */
export const getPoolsByRiskTool = tool(
  async ({ minRiskScore, maxRiskScore }) => {
    const pools = await getPoolsByRiskScoreRange(db, {
      minRiskScore,
      maxRiskScore,
      chainId: 146,
    });
    
    // Tools must return strings
    return formatPoolsToCSV(pools);
  },
  {
    name: "get_pools_by_risk",
    description: "Get pools by precomputed risk level of the user",
    schema: getPoolsByRiskParameters,
  }
);
