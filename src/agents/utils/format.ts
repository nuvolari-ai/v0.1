import { PortfolioSummary, PoolWithRiskScore, TokenWithRiskScore } from "@nuvolari/agents/interfaces/resolver-types";

/**
 * Converts a PortfolioSummary object to the CSV format needed for the DeFi analyst system prompt
 * @param portfolio The portfolio summary returned by calculateAccountPortfolio
 * @returns A formatted CSV string
 */
export function formatPortfolioToCSV(portfolio: PortfolioSummary): string {
    const { tokens, positions, total, portfolioRiskScore, riskGrade, userAddress } = portfolio;
    
    // Format the PORTFOLIO_SUMMARY section
    const portfolioSummary = `PORTFOLIO_SUMMARY\nTotalValue,$${total.toFixed(2)} RiskScore,${portfolioRiskScore} RiskGrade,${riskGrade},${portfolio.userAddress}\n`;
    
    // Format the TOKEN_HOLDINGS section
    let tokenHoldings = "TOKEN_HOLDINGS\nSymbol,Name,Amount,UsdValue,Percentage,RiskScore,Decimals\n";
    tokens.forEach(token => {
      tokenHoldings += `${token.tokenMetadata.symbol},${token.tokenMetadata.name},${token.amount},$${token.usdValue.toFixed(2)},${token.percentage}%,${token.riskScore},${token.decimals}\n`;
    });
    
    // Format the DEFI_POSITIONS section
    let defiPositions = "DEFI_POSITIONS\nProtocol,Position Name,USD Value,Percentage,Risk Score,Risk Grade\n";
    positions.forEach(position => {
      // Determine risk grade based on position's risk score
      let positionRiskGrade = "Unknown";
      const riskScore = position.riskScore;
      
      if (riskScore <= 1.8) {
        positionRiskGrade = "A";
      } else if (riskScore <= 2.4) {
        positionRiskGrade = "B";
      } else if (riskScore <= 3.0) {
        positionRiskGrade = "C";
      } else if (riskScore <= 3.6) {
        positionRiskGrade = "D";
      } else {
        positionRiskGrade = "E";
      }
      
      // Get protocol name from position metadata
      const protocolName = position.poolMetadata.protocol?.name || "Unknown";
      
      defiPositions += `${protocolName},${position.poolMetadata.name},$${position.usdValue.toFixed(2)},${position.percentage}%,${position.riskScore},${positionRiskGrade}\n`;
    });
    
    // Combine all sections into a single CSV string
    return `${portfolioSummary}\n${tokenHoldings}\n${defiPositions}`;
  }

/**
 * Formats the output from getPoolsByRiskScoreRange into the expected CSV format
 * for the DeFi analyst system prompt
 * 
 * @param pools Array of pools with risk scores returned by getPoolsByRiskScoreRange
 * @returns A formatted CSV string with YIELD_POOLS and TOKEN_OPPORTUNITIES sections
 */
export function formatPoolsToCSV(pools: PoolWithRiskScore[]): string {
  // Initialize CSV sections
  let yieldPools = "YIELD_POOLS\nProtocol,ProtocolSlug,Name,APY,Risk Score,Risk Grade,PoolAddress\n";
  
  // Process each pool
  pools.forEach(pool => {
    // Determine risk grade based on the combinedRiskScore
    let riskGrade: string;
    const riskScore = pool.combinedRiskScore;
    
    if (riskScore <= 1.8) {
      riskGrade = "A";
    } else if (riskScore <= 2.4) {
      riskGrade = "B";
    } else if (riskScore <= 3.0) {
      riskGrade = "C";
    } else if (riskScore <= 3.6) {
      riskGrade = "D";
    } else {
      riskGrade = "E";
    }
    
    // Generate a simulated APY based on the risk score (higher risk = higher APY)
    // This is just for demonstration - in a real implementation, you would use actual APY data
    const simulatedAPY = '1%';
    
    // Get protocol details
    const protocolName = pool.protocol?.name || "Unknown";
    const protocolSlug = pool.protocol?.ensoId || "unknown";
    
    // This is a yield pool
    yieldPools += `${protocolName},${protocolSlug},${pool.name},${simulatedAPY},${riskScore.toFixed(1)},${riskGrade},${pool.receiptTokenId}\n`;
  });
  
  // Return the combined CSV string
  return `${yieldPools}`;
}

/**
 * Formats the output from getPoolsByRiskScoreRange into the expected CSV format
 * for the DeFi analyst system prompt
 * 
 * @param tokens Array of tokens with risk scores returned by getTokenRisks
 * @returns A formatted CSV string with TOKEN_OPPORTUNITIES sections
 */
export function formatTokensToCSV(tokens: TokenWithRiskScore[]): string {
  let tokensCSV = "TOKENS\nToken,RiskScore,Address,Decimals\n";
  tokens.forEach(token => {
    tokensCSV += `${token.symbol},${token.riskScore},${token.id},${token.decimals}\n`;
  });
  return tokensCSV;
}