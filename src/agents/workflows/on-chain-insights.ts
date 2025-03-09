import { PortfolioSummary } from "@nuvolari/server/api/routers/_resolvers/calculate-account-portfolio";
import { formatPoolsToCSV, formatPortfolioToCSV } from "../utils/format";
import { NuvolariAgent } from "../core/agent";
import { db } from "@nuvolari/server/db";
import { getPoolsByRiskScoreRange } from "../core/_resolvers/pool-risks";

/**
 * Generate insights based on user's portfolio and risk profile
 * @param agent The compiled LangGraph agent
 * @param formattedPortfolio User's portfolio in CSV format
 * @param minRiskScore Minimum risk score for investment recommendations
 * @param maxRiskScore Maximum risk score for investment recommendations
 * @returns Insights in CSV format
 */
export async function generateInsights(
  agent: NuvolariAgent,
  portfolio: PortfolioSummary,
  minRiskScore: number,
  maxRiskScore: number
): Promise<string> {
  try {
    const formattedPortfolio = formatPortfolioToCSV(portfolio);
    const poolsData = await getPoolsByRiskScoreRange(db, {
      minRiskScore,
      maxRiskScore,
      chainId: 146,
    });

    const opportunitiesCSV = formatPoolsToCSV(poolsData);

    const recommendations = await agent.invoke({
      lowestRisk: minRiskScore,
      highestRisk: maxRiskScore,
      portfolio: formattedPortfolio,
      opportunities: opportunitiesCSV
    });
    
    return recommendations.output;
  } catch (error) {
    console.error("Error generating investment recommendations:", error);
    throw error;
  }
}


type Insight = {
  tokenIn: string;
  tokenInAmount: string;
  tokenInDecimals: number;
  tokenOut: string;
  apiCall: string;
  insightShort: string;
  insightDetailed: string;
  protocolSlug: string;
}

/**
 * Parse CSV recommendations into a structured format
 * @param csvInsights CSV string returned by the agent
 * @returns Array of structured recommendation objects
 */
export function parseInsights(csvInsights: string): Array<Insight> {
  const lines = csvInsights.trim().split('\n');
  const results: Insight[] = [];
  
  // Skip header if present
  const startIdx = lines[0]?.includes('TokenIn') ? 1 : 0;
  
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;
    
    const [
      tokenIn,
      tokenInAmount,
      tokenInDecimals,
      tokenOut,
      apiCall,
      insightShort,
      insightDetailed,
      protocolSlug
    ] = line.split(',').map(item => item.trim());
    
    results.push({
      tokenIn: tokenIn || '',
      tokenInAmount: tokenInAmount || '',
      tokenInDecimals: parseInt(tokenInDecimals || '18'), // Default to 18 if parsing fails
      tokenOut: tokenOut || '',
      apiCall: apiCall || '',
      insightShort: insightShort || '',
      insightDetailed: insightDetailed || '',
      protocolSlug: protocolSlug || ''
    });
  }
  
  return results;
}
