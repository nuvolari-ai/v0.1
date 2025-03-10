import { PortfolioSummary } from "@nuvolari/server/api/routers/_resolvers/calculate-account-portfolio";
import { formatPortfolioToCSV } from "../utils/format";
import { NuvolariAgent } from "../core/agent";

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
    
    const recommendations = await agent.invoke({
      lowestRisk: minRiskScore,
      highestRisk: maxRiskScore,
      portfolio: formattedPortfolio,
    });

    const output = recommendations?.messages?.[recommendations.messages.length - 1]?.content ?? '';
    
    return output;
  } catch (error) {
    console.error("Error generating investment recommendations:", error);
    throw error;
  }
}



/**
 * Parse CSV recommendations into a structured format
 * @param csvInsights CSV string returned by the agent
 * @returns Array of structured recommendation objects
 */
export interface RawInsight {
  tokenIn: string;
  tokenInAmount: string;
  tokenInDecimals: number;
  tokenOut: string;
  apiCall: string;
  insightShort: string;
  insightDetailed: string;
  protocolSlug: string;
  insightType: string;
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
    
    const insight = {
      tokenIn: '',
      tokenInAmount: '',
      tokenInDecimals: 0,
      tokenOut: '',
      apiCall: '',
      insightShort: '',
      insightDetailed: '',
      protocolSlug: '',
      insightType: ''
    };
    
    headers.forEach((header: string, index: number) => {
      const property = header.charAt(0).toLowerCase() + header.slice(1);
      
      // Special handling for tokenInDecimals to ensure it's a number
      if (property === 'tokenInDecimals') {
        insight[property] = parseInt(values[index] || '0', 10);
      } else {
        // @ts-expect-error
        insight[property] = values[index] || '';
      }
    });
    
    result.push(insight);
  }
  
  return result;
}