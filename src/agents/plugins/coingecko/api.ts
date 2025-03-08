export interface CoinGeckoToken {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: any | null;
    last_updated: string;
  }
  
  export class CoinGeckoAPI {
    private baseUrl = 'https://api.coingecko.com/api/v3';
    private apiKey: string | null;
  
    /**
     * Creates a new CoinGecko service instance
     * @param apiKey Optional CoinGecko API key for higher rate limits
     */
    constructor(apiKey?: string) {
      this.apiKey = apiKey || null;
    }
  
    /**
     * Fetches tokens in the Sonic ecosystem
     * @param vsCurrency Currency to compare against (default: 'usd')
     * @param options Additional query parameters
     * @returns Promise with array of token data
     */
    async getSonicEcosystemTokens(
      vsCurrency = 'usd',
      ids: string[] = [],
    ): Promise<CoinGeckoToken[]> {
  
      const headers: HeadersInit = {
        'accept': 'application/json'
      };
  
      // Add API key if provided
      if (this.apiKey) {
        headers['x-cg-demo-api-key'] = this.apiKey;
      }
  
      try {
        const response = await fetch(
          `${this.baseUrl}/coins/markets?vs_currency=${vsCurrency}&ids=${ids.join(',')}`,
          { headers }
        );
  
        if (!response.ok) {
          throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
        }
  
        const data: CoinGeckoToken[] = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching Sonic ecosystem tokens:', error);
        throw error;
      }
    }
  }