import { Insight } from '@prisma/client';
import { OdosApiClient, PathRequestV2, QuoteResponse, AssemblePathRequest, PathResponse } from './api';


function convertToBigInt(valueStr: string, decimals: number): bigint {
    if (!valueStr || valueStr.trim() === '') {
      return BigInt(0);
    }
  
    try {
      if (valueStr.includes('e') || valueStr.includes('E')) {
        const numberValue = Number(valueStr);
        
        const fullDigitString = numberValue.toLocaleString('fullwide', { useGrouping: false });
        
        return BigInt(fullDigitString.replace('.', ''));
      }
      
      return BigInt(valueStr);
    } catch (error) {
      console.error(`Error converting ${valueStr} to BigInt:`, error);
      throw new Error(`Failed to convert ${valueStr} to BigInt`);
    }
  }
    

/**
 * Service for handling token swaps using the Odos API
 */
export class TokenSwapService {
  private odosClient: OdosApiClient;
  
  constructor(baseUrl: string = 'https://api.odos.xyz') {
    this.odosClient = new OdosApiClient(baseUrl);
  }
  
  /**
   * Creates a swap payload using an insight with TOKEN_OPPORTUNITY type
   * 
   * @param insight The insight to create a swap payload for
   * @param userAddress The user's wallet address
   * @param chainId The blockchain chain ID
   * @param tokenInAmount The amount of input token to swap
   * @param slippageLimitPercent Optional slippage limit (defaults to 0.5%)
   * @returns Promise resolving to the swap transaction payload
   */
  async createSwapPayloadFromInsight(
    insight: Insight,
    userAddress: string,
    chainId: number,
    tokenInAmount: string,
    slippageLimitPercent: number = 0.5
  ): Promise<{
    quote: QuoteResponse;
    transaction: PathResponse;
  }> {
    // Validate insight type
    if (insight.type !== 'TOKEN_OPPORTUNITY') {
      throw new Error(`Unsupported insight type: ${insight.type}. Expected TOKEN_OPPORTUNITY.`);
    }
    
    if (!insight.tokenOutId) {
      throw new Error('Missing tokenOutId in insight');
    }
    
    // Handle scientific notation in amount if present
    const parsedAmount = convertToBigInt(tokenInAmount, insight.tokenInDecimals).toString();
    
    // Create quote request
    const quoteRequest: PathRequestV2 = {
      chainId,
      inputTokens: [{
        tokenAddress: insight.tokenInId,
        amount: parsedAmount
      }],
      outputTokens: [{
        tokenAddress: insight.tokenOutId,
        proportion: 1.0
      }],
      userAddr: userAddress,
      slippageLimitPercent,
      disableRFQs: false, // Enable RFQs for potentially better rates
      compact: true,
    };
    
    try {
      // Generate quote
      const quote = await this.odosClient.generateQuote(quoteRequest);
      
      // Assemble transaction
      const assembleRequest: AssemblePathRequest = {
        userAddr: userAddress,
        pathId: quote.pathId,
        simulate: true, // Run simulation to ensure transaction is valid
      };
      
      const transaction = await this.odosClient.assemblePath(assembleRequest);
      
      return {
        quote,
        transaction
      };
    } catch (error) {
      console.error('Error generating swap from insight:', error);
      throw error;
    }
  }
  
  /**
   * Execute a swap transaction using the Odos API
   * This method doesn't actually send the transaction but prepares it for sending
   * 
   * @param insight The TOKEN_OPPORTUNITY insight to execute
   * @param userAddress The user's wallet address
   * @param chainId The blockchain chain ID
   * @param tokenInAmount The amount of input token to swap
   * @returns Promise resolving to the transaction data ready to be signed and sent
   */
  async executeSwapFromInsight(
    insight: Insight,
    userAddress: string,
    chainId: number,
    tokenInAmount: string
  ): Promise<{
    transaction: any;
    expectedOutput: string;
  }> {
    const swapPayload = await this.createSwapPayloadFromInsight(
      insight,
      userAddress,
      chainId,
      tokenInAmount
    );
    
    if (!swapPayload.transaction.transaction) {
      throw new Error('Transaction assembly failed');
    }
    
    // Return the transaction data and expected output amount
    return {
      transaction: swapPayload.transaction.transaction,
      expectedOutput: swapPayload.quote.outAmounts[0] ?? '0'
    };
  }
}