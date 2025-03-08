import { PrismaClient } from '@prisma/client';
import { CoinGeckoAPI } from '../../agents/tools/coingecko/api';

const prisma = new PrismaClient();
const coinGeckoService = new CoinGeckoAPI(process.env.COINGECKO_API_KEY);

/**
 * Calculates risk score for a token based on various metrics
 * This is a placeholder implementation - you should replace with your actual risk calculation logic
 */
function calculateRiskScore(token: any): number {
  // Sample risk calculation factors:
  // 1. Market cap (lower = higher risk)
  const marketCapRisk = token.market_cap ? Math.max(1, 5 - Math.log10(token.market_cap) / 2) : 3;
  
  // 2. Price volatility (higher = higher risk)
  const volatilityRisk = Math.abs(token.price_change_percentage_24h || 0) > 15 ? 3.5 : 2;
  
  // 3. Liquidity (lower volume/market cap ratio = higher risk)
  const liquidityRatio = token.market_cap && token.total_volume ? token.total_volume / token.market_cap : 0;
  const liquidityRisk = liquidityRatio < 0.05 ? 3.5 : liquidityRatio < 0.1 ? 3 : liquidityRatio < 0.2 ? 2.5 : 2;
  
  // 4. Project maturity (ATH percentage drop, higher = higher risk)
  const athDropRisk = Math.abs(token.ath_change_percentage || 0) > 80 ? 3.5 : 
                    Math.abs(token.ath_change_percentage || 0) > 60 ? 3 : 
                    Math.abs(token.ath_change_percentage || 0) > 40 ? 2.5 : 2;
  
  // Calculate final risk score (1-5 scale, where 5 is highest risk)
  const riskScore = (marketCapRisk + volatilityRisk + liquidityRisk + athDropRisk) / 4;
  
  // Ensure the score is between 1 and 5
  return Math.max(1, Math.min(5, riskScore));
}

/**
 * Updates risk scores for all tokens in the database
 */
export async function updateTokenRisks() {
  try {
    console.log('Starting token risk update job...');
    
    // Get all tokens from database
    const tokens = await prisma.token.findMany({
      where: {
        coingeckoId: {
          not: null
        }
      }
    });
    
    console.log(`Found ${tokens.length} tokens to update`);

    const geckoIds = tokens.map((token) => token.coingeckoId).filter((id) => id !== null);
    
    // Get token data from CoinGecko
    const geckoTokens = await coinGeckoService.getSonicEcosystemTokens(undefined, geckoIds);
    
    // Process each token
    let updatedCount = 0;
    for (const dbToken of tokens) {
      try {
        // Find matching token data from CoinGecko
        const geckoToken = geckoTokens.find(t => t.id === dbToken.coingeckoId);
        
        if (geckoToken) {
          // Calculate risk score
          const riskScore = calculateRiskScore(geckoToken);
          
          // Insert new risk record
          await prisma.tokenRisk.create({
            data: {
              tokenId: dbToken.id,
              riskScore
            }
          });
          
          updatedCount++;
        } else {
          console.log(`No CoinGecko data found for token ${dbToken.name} (${dbToken.coingeckoId})`);
        }
      } catch (error) {
        console.error(`Error updating risk for token ${dbToken.name}:`, error);
      }
    }
    
    console.log(`Successfully updated risk scores for ${updatedCount} tokens`);

    return { updatedCount };
  } catch (error) {
    console.error('Error in token risk update job:', error);
  } finally {
    await prisma.$disconnect();
  }
}
