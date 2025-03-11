// Types from the Odos API
export interface TokenAmount {
    tokenAddress: string;
    amount: string;
  }
  
  export interface TokenProportion {
    tokenAddress: string;
    proportion: number;
  }
  
  export interface PathRequestV2 {
    chainId: number;
    inputTokens: TokenAmount[];
    outputTokens: TokenProportion[];
    gasPrice?: number;
    userAddr?: string;
    slippageLimitPercent?: number;
    sourceBlacklist?: string[];
    sourceWhitelist?: string[];
    poolBlacklist?: string[];
    pathVizImage?: boolean;
    disableRFQs?: boolean;
    referralCode?: number;
    compact?: boolean;
    likeAsset?: boolean;
    simple?: boolean;
  }
  
  export interface QuoteResponse {
    pathId: string;
    inTokens: string[];
    outTokens: string[];
    inAmounts: string[];
    outAmounts: string[];
    gasEstimate: number;
    dataGasEstimate: number;
    gweiPerGas: number;
    gasEstimateValue: number;
    inValues: number[];
    outValues: number[];
    netOutValue: number;
    priceImpact: number | null;
    percentDiff: number;
    partnerFeePercent: number;
    blockNumber: number;
    pathVizImage?: string;
  }
  
  export interface AssemblePathRequest {
    userAddr: string;
    pathId: string;
    simulate?: boolean;
    receiver?: string;
  }
  
  export interface Transaction {
    gas: number;
    gasPrice: number;
    value: string;
    to: string;
    from: string;
    data: string;
    nonce: number;
    chainId: number;
  }
  
  export interface Simulation {
    isSuccess: boolean;
    amountsOut: number[];
    gasEstimate: number;
    simulationError: any | null;
  }
  
  export interface PathResponse {
    blockNumber: number;
    gasEstimate: number;
    gasEstimateValue: number;
    inputTokens: TokenAmount[];
    outputTokens: TokenAmount[];
    netOutValue: number;
    outValues: string[];
    transaction: Transaction | null;
    simulation: Simulation | null;
  }
  
  /**
   * Client for interacting with the Odos API
   */
  export class OdosApiClient {
    private baseUrl: string;
    private apiVersion: string = 'v2';
  
    /**
     * Creates a new Odos API client
     * @param baseUrl The base URL for the Odos API (default: 'https://api.odos.xyz')
     */
    constructor(baseUrl: string = 'https://api.odos.xyz') {
      this.baseUrl = baseUrl;
    }
  
    /**
     * Makes a GET request to the Odos API
     * @param endpoint API endpoint to call
     * @returns Promise resolving to the response data
     */
    private async get<T>(endpoint: string): Promise<T> {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.json() as Promise<T>;
    }
  
    /**
     * Makes a POST request to the Odos API
     * @param endpoint API endpoint to call
     * @param data Request body data
     * @returns Promise resolving to the response data
     */
    private async post<T>(endpoint: string, data: any): Promise<T> {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.json() as Promise<T>;
    }
  
    /**
     * Get supported chain IDs
     * @returns Promise resolving to array of supported chain IDs
     */
    async getSupportedChains(): Promise<number[]> {
      const response = await this.get<{ chains: number[] }>('/info/chains');
      return response.chains;
    }
  
    /**
     * Get contract info for a specific chain and router version
     * @param chainId Chain ID to get contract info for
     * @returns Promise resolving to contract info
     */
    async getContractInfo(chainId: number): Promise<any> {
      return this.get<any>(`/info/contract-info/${this.apiVersion}/${chainId}`);
    }
  
    /**
     * Get supported tokens for a specific chain
     * @param chainId Chain ID to get tokens for
     * @returns Promise resolving to token map
     */
    async getSupportedTokens(chainId: number): Promise<any> {
      const response = await this.get<{ tokenMap: any }>(`/info/tokens/${chainId}`);
      return response.tokenMap;
    }
  
    /**
     * Generate a quote for a swap
     * @param quoteRequest Quote request parameters
     * @returns Promise resolving to quote response
     */
    async generateQuote(quoteRequest: PathRequestV2): Promise<QuoteResponse> {
      return this.post<QuoteResponse>(`/sor/quote/${this.apiVersion}`, quoteRequest);
    }
  
    /**
     * Assemble a path from a quote
     * @param assembleRequest Assemble request parameters
     * @returns Promise resolving to path response
     */
    async assemblePath(assembleRequest: AssemblePathRequest): Promise<PathResponse> {
      return this.post<PathResponse>('/sor/assemble', assembleRequest);
    }
  
    /**
     * Get token price
     * @param chainId Chain ID of token
     * @param tokenAddress Token address
     * @returns Promise resolving to token price
     */
    async getTokenPrice(chainId: number, tokenAddress: string): Promise<any> {
      return this.get<any>(`/pricing/token/${chainId}/${tokenAddress}`);
    }
  }