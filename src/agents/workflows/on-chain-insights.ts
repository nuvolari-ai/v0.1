import { PortfolioSummary } from "@nuvolari/agents/interfaces/resolver-types";
import { RawInsight } from "@nuvolari/agents/interfaces/workflow-types";
import { formatPortfolioToCSV } from "../utils/format";
import { NuvolariAgent } from "../core/agent";
import { indexRawInsights } from "@nuvolari/server/api/routers/_resolvers/insights";

/**
 * Generate insights based on user's portfolio and risk profile and index them in the database
 * @param agent The compiled LangGraph agent
 * @param portfolio User's portfolio
 * @param userAddress User's blockchain address
 * @param minRiskScore Minimum risk score for investment recommendations
 * @param maxRiskScore Maximum risk score for investment recommendations
 * @returns Indexed insights
 */
export async function generateAndIndexInsights(
  agent: NuvolariAgent,
  portfolio: PortfolioSummary,
  userAddress: string,
  minRiskScore: number,
  maxRiskScore: number
) {
  try {
    // First generate the insights
    const formattedPortfolio = formatPortfolioToCSV(portfolio);
    
    const recommendations = await agent.invoke({
      lowestRisk: minRiskScore,
      highestRisk: maxRiskScore,
      portfolio: formattedPortfolio,
    });
    
    const output = recommendations?.messages?.[recommendations.messages.length - 1]?.content ?? '';
    
    // Parse the insights from CSV
    const rawInsights = parseInsights(output);
    
    // Index the insights in the database
    const indexedInsights = await indexRawInsights(rawInsights, userAddress);
    
    return indexedInsights;
  } catch (error) {
    console.error("Error generating and indexing insights:", error);
    throw error;
  }
}

/**
 * Parses the CSV output from NuvolariAI into a structured array of RawInsight objects
 * @param {string} csvString - Raw CSV string from LLM output
 * @returns {Array<RawInsight>} Array of RawInsight objects
 */
export function parseInsights(csvString: string): RawInsight[] {
  // Clean up the input in case it has markdown backticks or any other non-CSV content
  const cleanedCsv = csvString.replace(/```csv\n|```\n|```/g, '').trim();
  
  const lines = cleanedCsv.split('\n');
  if (lines.length < 2) {
    throw new Error('Invalid CSV: Not enough lines');
  }
  
  const headers = lines[0]?.split(',') ?? [];
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let char of lines[i] ?? '') {
      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    values.push(currentValue);
    
    const insight: Partial<RawInsight> = {};
    
    headers.forEach((header: string, index: number) => {
      const property = header.charAt(0).toLowerCase() + header.slice(1);
      
      // Special handling for tokenInDecimals to ensure it's a number
      if (property === 'tokenInDecimals') {
        insight[property] = parseInt(values[index] || '0', 10);
      } else {
        // @ts-expect-error - Dynamically assigning properties
        insight[property] = values[index] || '';
      }
    });
    
    result.push(insight as RawInsight);
  }
  
  return result;
}