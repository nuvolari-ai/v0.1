/**
 * DefiLlama API Client
 *
 * A TypeScript client for the DefiLlama API
 */

// Base interfaces
export interface ApiConfig {
    baseUrl?: string;
    coinsBaseUrl?: string;
    stablecoinsBaseUrl?: string;
    yieldsBaseUrl?: string;
  }
  
  // Common response types
  export interface ProtocolTvl {
    id: string;
    name: string;
    symbol: string;
    chain: string;
    category: string;
    tvl: number;
    change_1h: number;
    change_1d: number;
    change_7d: number;
  }
  
  export interface ChainTvl {
    name: string;
    tvl: number;
    tokenSymbol: string;
    cmcId: number;
    gecko_id: string;
  }
  
  export interface HistoricalTvlData {
    date: number;
    tvl: number;
  }
  
  export interface ProtocolData {
    id: string;
    name: string;
    address: string;
    symbol: string;
    url: string;
    description: string;
    chain: string;
    logo: string;
    tvl: number;
    change_1h: number;
    change_1d: number;
    change_7d: number;
    tvlList: HistoricalTvlData[];
    tokenBreakdowns?: Record<string, HistoricalTvlData[]>;
    chainBreakdowns?: Record<string, HistoricalTvlData[]>;
  }
  
  export interface CoinPrice {
    decimals: number;
    price: number;
    symbol: string;
    timestamp: number;
    confidence?: number;
  }
  
  export interface CurrentPricesResponse {
    coins: Record<string, CoinPrice>;
  }
  
  export interface HistoricalPrice extends CoinPrice {
    timestamp: number;
  }
  
  export interface ChartPrice {
    prices: Array<{
      timestamp: number;
      price: number;
    }>;
    symbol: string;
    confidence?: number;
    decimals?: number;
  }
  
  export interface PriceChartResponse {
    coins: Record<string, ChartPrice>;
  }
  
  export interface PricePercentageResponse {
    coins: Record<string, number>;
  }
  
  export interface FirstPriceResponse {
    coins: Record<string, {
      price: number;
      symbol: string;
      timestamp: number;
    }>;
  }
  
  export interface BlockResponse {
    height: number;
    timestamp: number;
  }
  
  // Stablecoin interfaces
  export interface Stablecoin {
    id: string;
    name: string;
    symbol: string;
    pegType: string;
    pegMechanism: string;
    circulating: number;
    price?: number;
  }
  
  export interface StablecoinChartData {
    date: number;
    totalCirculating: number;
    totalCirculatingUSD: number;
  }
  
  export type StablecoinChainData = Record<string, number>;
  
  export type StablecoinPriceData = Record<string, Array<{
      date: number;
      price: number;
    }>>;
  
  // Yields interfaces
  export interface YieldPool {
    pool: string;
    chain: string;
    project: string;
    symbol: string;
    tvlUsd: number;
    apyBase: number;
    apyReward: number;
    apy: number;
  }
  
  export interface YieldChartData {
    timestamp: number;
    tvlUsd: number;
    apy: number;
  }
  
  // Volumes interfaces
  export interface VolumeData {
    totalVolume: number;
    dailyVolume: number;
    totalVolumeUSD: number;
    dailyVolumeUSD: number;
  }
  
  export interface DexData extends VolumeData {
    name: string;
    disabled: boolean;
  }
  
  export interface DexOverview {
    protocols: DexData[];
    totalDataChart: Array<{
      date: number;
      dailyVolume: number;
      totalVolume: number;
    }>;
    totalDataChartBreakdown: Record<string, Array<{
      date: number;
      dailyVolume: number;
      totalVolume: number;
    }>>;
    allChains: string[];
  }
  
  export interface OptionsDexData extends VolumeData {
    name: string;
    disabled: boolean;
    dailyNotionalVolume: number;
    dailyPremiumVolume: number;
    totalNotionalVolume: number;
    totalPremiumVolume: number;
  }
  
  export interface OptionsDexOverview {
    protocols: OptionsDexData[];
  }
  
  // Fees and Revenue interfaces
  export interface FeesData {
    name: string;
    disabled: boolean;
    totalFees: number;
    totalRevenue: number;
    dailyFees: number;
    dailyRevenue: number;
  }
  
  export interface FeesOverview {
    protocols: FeesData[];
  }
  
  /**
   * DefiLlama API Client
   */
  export class DefiLlamaClient {
    private baseUrl: string;
    private coinsBaseUrl: string;
    private stablecoinsBaseUrl: string;
    private yieldsBaseUrl: string;
  
    constructor(config: ApiConfig = {}) {
      this.baseUrl = config.baseUrl || 'https://api.llama.fi';
      this.coinsBaseUrl = config.coinsBaseUrl || 'https://coins.llama.fi';
      this.stablecoinsBaseUrl = config.stablecoinsBaseUrl || 'https://stablecoins.llama.fi';
      this.yieldsBaseUrl = config.yieldsBaseUrl || 'https://yields.llama.fi';
    }
  
    /**
     * Helper method to make API requests
     */
    private async request<T>(url: string, baseUrl: string = this.baseUrl): Promise<T> {
      const response = await fetch(`${baseUrl}${url}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return response.json() as Promise<T>;
    }
  
    /**
     * TVL Endpoints
     */
  
    /**
     * List all protocols on DefiLlama along with their TVL
     */
    async getAllProtocols(): Promise<ProtocolTvl[]> {
      return this.request<ProtocolTvl[]>('/protocols');
    }
  
    /**
     * Get historical TVL of a protocol and breakdowns by token and chain
     * @param protocol Protocol slug (e.g., "aave")
     */
    async getProtocol(protocol: string): Promise<ProtocolData> {
      return this.request<ProtocolData>(`/protocol/${protocol}`);
    }
  
    /**
     * Get historical TVL (excludes liquid staking and double counted TVL) of DeFi on all chains
     */
    async getHistoricalTvl(): Promise<HistoricalTvlData[]> {
      return this.request<HistoricalTvlData[]>('/v2/historicalChainTvl');
    }
  
    /**
     * Get historical TVL (excludes liquid staking and double counted TVL) of a chain
     * @param chain Chain slug (e.g., "Ethereum")
     */
    async getHistoricalChainTvl(chain: string): Promise<HistoricalTvlData[]> {
      return this.request<HistoricalTvlData[]>(`/v2/historicalChainTvl/${chain}`);
    }
  
    /**
     * Simplified endpoint to get current TVL of a protocol
     * @param protocol Protocol slug (e.g., "uniswap")
     */
    async getProtocolTvl(protocol: string): Promise<number> {
      return this.request<number>(`/tvl/${protocol}`);
    }
  
    /**
     * Get current TVL of all chains
     */
    async getAllChainsTvl(): Promise<ChainTvl[]> {
      return this.request<ChainTvl[]>('/v2/chains');
    }
  
    /**
     * Coin/Price Endpoints
     */
  
    /**
     * Get current prices of tokens by contract address
     * @param coins Comma-separated tokens defined as {chain}:{address}
     * @param searchWidth Time range on either side to find price data, defaults to 6 hours
     */
    async getCurrentPrices(coins: string, searchWidth?: string): Promise<CurrentPricesResponse> {
      const url = `/prices/current/${coins}${searchWidth ? `?searchWidth=${searchWidth}` : ''}`;
      return this.request<CurrentPricesResponse>(url, this.coinsBaseUrl);
    }
  
    /**
     * Get historical prices of tokens by contract address
     * @param timestamp UNIX timestamp of time when you want historical prices
     * @param coins Comma-separated tokens defined as {chain}:{address}
     * @param searchWidth Time range on either side to find price data, defaults to 6 hours
     */
    async getHistoricalPrices(timestamp: number, coins: string, searchWidth?: string): Promise<CurrentPricesResponse> {
      const url = `/prices/historical/${timestamp}/${coins}${searchWidth ? `?searchWidth=${searchWidth}` : ''}`;
      return this.request<CurrentPricesResponse>(url, this.coinsBaseUrl);
    }
  
    /**
     * Get historical prices for multiple tokens at multiple different timestamps
     * @param coins Object where keys are coins in the form {chain}:{address}, and values are arrays of requested timestamps
     * @param searchWidth Time range on either side to find price data, defaults to 6 hours
     */
    async getBatchHistoricalPrices(coins: Record<string, number[]>, searchWidth?: string | number): Promise<Record<string, { symbol: string; prices: HistoricalPrice[] }>> {
      const url = `/batchHistorical?coins=${encodeURIComponent(JSON.stringify(coins))}${searchWidth ? `&searchWidth=${searchWidth}` : ''}`;
      return this.request<Record<string, { symbol: string; prices: HistoricalPrice[] }>>(url, this.coinsBaseUrl);
    }
  
    /**
     * Get token prices at regular time intervals
     * @param coins Comma-separated tokens defined as {chain}:{address}
     * @param start Unix timestamp of earliest data point requested
     * @param end Unix timestamp of latest data point requested
     * @param span Number of data points returned, defaults to 0
     * @param period Duration between data points, defaults to 24 hours
     * @param searchWidth Time range on either side to find price data, defaults to 10% of period
     */
    async getPriceChart(
      coins: string,
      start?: number,
      end?: number,
      span?: number,
      period?: string,
      searchWidth?: string | number
    ): Promise<PriceChartResponse> {
      let url = `/chart/${coins}?`;
      if (start) url += `start=${start}&`;
      if (end) url += `end=${end}&`;
      if (span) url += `span=${span}&`;
      if (period) url += `period=${period}&`;
      if (searchWidth) url += `searchWidth=${searchWidth}&`;
      
      // Remove trailing '&' or '?'
      url = url.replace(/[?&]$/, '');
      
      return this.request<PriceChartResponse>(url, this.coinsBaseUrl);
    }
  
    /**
     * Get percentage change in price over time
     * @param coins Comma-separated tokens defined as {chain}:{address}
     * @param timestamp Timestamp of data point requested, defaults to time now
     * @param lookForward Whether you want the duration after your given timestamp or not, defaults to false (looking back)
     * @param period Duration between data points, defaults to 24 hours
     */
    async getPricePercentageChange(
      coins: string,
      timestamp?: number,
      lookForward?: boolean,
      period?: string
    ): Promise<PricePercentageResponse> {
      let url = `/percentage/${coins}?`;
      if (timestamp) url += `timestamp=${timestamp}&`;
      if (lookForward !== undefined) url += `lookForward=${lookForward}&`;
      if (period) url += `period=${period}&`;
      
      // Remove trailing '&' or '?'
      url = url.replace(/[?&]$/, '');
      
      return this.request<PricePercentageResponse>(url, this.coinsBaseUrl);
    }
  
    /**
     * Get earliest timestamp price record for coins
     * @param coins Comma-separated tokens defined as {chain}:{address}
     */
    async getFirstPrices(coins: string): Promise<FirstPriceResponse> {
      return this.request<FirstPriceResponse>(`/prices/first/${coins}`, this.coinsBaseUrl);
    }
  
    /**
     * Get the closest block to a timestamp
     * @param chain Chain which you want to get the block from
     * @param timestamp UNIX timestamp of the block you are searching for
     */
    async getBlock(chain: string, timestamp: number): Promise<BlockResponse> {
      return this.request<BlockResponse>(`/block/${chain}/${timestamp}`, this.coinsBaseUrl);
    }
  
    /**
     * Stablecoin Endpoints
     */
  
    /**
     * List all stablecoins along with their circulating amounts
     * @param includePrices Set whether to include current stablecoin prices
     */
    async getAllStablecoins(includePrices?: boolean): Promise<Stablecoin[]> {
      const url = `/stablecoins${includePrices ? '?includePrices=true' : ''}`;
      return this.request<Stablecoin[]>(url, this.stablecoinsBaseUrl);
    }
  
    /**
     * Get historical mcap sum of all stablecoins
     * @param stablecoinId Stablecoin ID, you can get these from /stablecoins
     */
    async getStablecoinCharts(stablecoinId?: number): Promise<StablecoinChartData[]> {
      const url = `/stablecoincharts/all${stablecoinId ? `?stablecoin=${stablecoinId}` : ''}`;
      return this.request<StablecoinChartData[]>(url, this.stablecoinsBaseUrl);
    }
  
    /**
     * Get historical mcap sum of all stablecoins in a chain
     * @param chain Chain slug, you can get these from /chains or the chains property on /protocols
     * @param stablecoinId Stablecoin ID, you can get these from /stablecoins
     */
    async getStablecoinChainCharts(chain: string, stablecoinId?: number): Promise<StablecoinChartData[]> {
      const url = `/stablecoincharts/${chain}${stablecoinId ? `?stablecoin=${stablecoinId}` : ''}`;
      return this.request<StablecoinChartData[]>(url, this.stablecoinsBaseUrl);
    }
  
    /**
     * Get historical mcap and historical chain distribution of a stablecoin
     * @param assetId Stablecoin ID, you can get these from /stablecoins
     */
    async getStablecoinData(assetId: number): Promise<{
      circulating: StablecoinChartData[];
      chainCirculating: Record<string, StablecoinChartData[]>;
    }> {
      return this.request<{
        circulating: StablecoinChartData[];
        chainCirculating: Record<string, StablecoinChartData[]>;
      }>(`/stablecoin/${assetId}`, this.stablecoinsBaseUrl);
    }
  
    /**
     * Get current mcap sum of all stablecoins on each chain
     */
    async getStablecoinChains(): Promise<StablecoinChainData> {
      return this.request<StablecoinChainData>('/stablecoinchains', this.stablecoinsBaseUrl);
    }
  
    /**
     * Get historical prices of all stablecoins
     */
    async getStablecoinPrices(): Promise<StablecoinPriceData> {
      return this.request<StablecoinPriceData>('/stablecoinprices', this.stablecoinsBaseUrl);
    }
  
    /**
     * Yields Endpoints
     */
  
    /**
     * Retrieve the latest data for all pools, including enriched information such as predictions
     */
    async getAllPools(): Promise<YieldPool[]> {
      return this.request<YieldPool[]>('/pools', this.yieldsBaseUrl);
    }
  
    /**
     * Get historical APY and TVL of a pool
     * @param poolId Pool id, can be retrieved from /pools (property is called pool)
     */
    async getPoolChart(poolId: string): Promise<YieldChartData[]> {
      return this.request<YieldChartData[]>(`/chart/${poolId}`, this.yieldsBaseUrl);
    }
  
    /**
     * Volume Endpoints
     */
  
    /**
     * List all dexs along with summaries of their volumes and dataType history data
     * @param excludeTotalDataChart True to exclude aggregated chart from response
     * @param excludeTotalDataChartBreakdown True to exclude broken down chart from response
     * @param dataType Desired data type, dailyVolume by default
     */
    async getDexOverview(
      excludeTotalDataChart?: boolean,
      excludeTotalDataChartBreakdown?: boolean,
      dataType?: 'dailyVolume' | 'totalVolume'
    ): Promise<DexOverview> {
      let url = '/overview/dexs?';
      if (excludeTotalDataChart) url += 'excludeTotalDataChart=true&';
      if (excludeTotalDataChartBreakdown) url += 'excludeTotalDataChartBreakdown=true&';
      if (dataType) url += `dataType=${dataType}&`;
      
      // Remove trailing '&' or '?'
      url = url.replace(/[?&]$/, '');
      
      return this.request<DexOverview>(url);
    }
  
    /**
     * List all dexs along with summaries of their volumes and dataType history data filtering by chain
     * @param chain Chain name, list of all supported chains can be found under allChains attribute in /overview/dexs response
     * @param excludeTotalDataChart True to exclude aggregated chart from response
     * @param excludeTotalDataChartBreakdown True to exclude broken down chart from response
     * @param dataType Desired data type, dailyVolume by default
     */
    async getDexChainOverview(
      chain: string,
      excludeTotalDataChart?: boolean,
      excludeTotalDataChartBreakdown?: boolean,
      dataType?: 'dailyVolume' | 'totalVolume'
    ): Promise<DexOverview> {
      let url = `/overview/dexs/${chain}?`;
      if (excludeTotalDataChart) url += 'excludeTotalDataChart=true&';
      if (excludeTotalDataChartBreakdown) url += 'excludeTotalDataChartBreakdown=true&';
      if (dataType) url += `dataType=${dataType}&`;
      
      // Remove trailing '&' or '?'
      url = url.replace(/[?&]$/, '');
      
      return this.request<DexOverview>(url);
    }
  
    /**
     * Get summary of dex volume with historical data
     * @param protocol Protocol slug
     * @param excludeTotalDataChart True to exclude aggregated chart from response
     * @param excludeTotalDataChartBreakdown True to exclude broken down chart from response
     * @param dataType Desired data type, dailyVolume by default
     */
    async getDexSummary(
      protocol: string,
      excludeTotalDataChart?: boolean,
      excludeTotalDataChartBreakdown?: boolean,
      dataType?: 'dailyVolume' | 'totalVolume'
    ): Promise<DexData & {
      totalDataChart: Array<{ date: number; [key: string]: number }>;
      totalDataChartBreakdown: Record<string, Array<{ date: number; [key: string]: number }>>;
    }> {
      let url = `/summary/dexs/${protocol}?`;
      if (excludeTotalDataChart) url += 'excludeTotalDataChart=true&';
      if (excludeTotalDataChartBreakdown) url += 'excludeTotalDataChartBreakdown=true&';
      if (dataType) url += `dataType=${dataType}&`;
      
      // Remove trailing '&' or '?'
      url = url.replace(/[?&]$/, '');
      
      return this.request<DexData & {
        totalDataChart: Array<{ date: number; [key: string]: number }>;
        totalDataChartBreakdown: Record<string, Array<{ date: number; [key: string]: number }>>;
      }>(url);
    }
  
    /**
     * List all options dexs along with summaries of their volumes and dataType history data
     * @param excludeTotalDataChart True to exclude aggregated chart from response
     * @param excludeTotalDataChartBreakdown True to exclude broken down chart from response
     * @param dataType Desired data type, dailyNotionalVolume by default
     */
    async getOptionsOverview(
      excludeTotalDataChart?: boolean,
      excludeTotalDataChartBreakdown?: boolean,
      dataType?: 'dailyPremiumVolume' | 'dailyNotionalVolume' | 'totalPremiumVolume' | 'totalNotionalVolume'
    ): Promise<OptionsDexOverview> {
      let url = '/overview/options?';
      if (excludeTotalDataChart) url += 'excludeTotalDataChart=true&';
      if (excludeTotalDataChartBreakdown) url += 'excludeTotalDataChartBreakdown=true&';
      if (dataType) url += `dataType=${dataType}&`;
      
      // Remove trailing '&' or '?'
      url = url.replace(/[?&]$/, '');
      
      return this.request<OptionsDexOverview>(url);
    }
  
    /**
     * List all options dexs along with summaries of their volumes and dataType history data filtering by chain
     * @param chain Chain name, list of all supported chains can be found under allChains attribute in /overview/options response
     * @param excludeTotalDataChart True to exclude aggregated chart from response
     * @param excludeTotalDataChartBreakdown True to exclude broken down chart from response
     * @param dataType Desired data type, dailyNotionalVolume by default
     */
    async getOptionsChainOverview(
      chain: string,
      excludeTotalDataChart?: boolean,
      excludeTotalDataChartBreakdown?: boolean,
      dataType?: 'dailyPremiumVolume' | 'dailyNotionalVolume' | 'totalPremiumVolume' | 'totalNotionalVolume'
    ): Promise<OptionsDexOverview> {
      let url = `/overview/options/${chain}?`;
      if (excludeTotalDataChart) url += 'excludeTotalDataChart=true&';
      if (excludeTotalDataChartBreakdown) url += 'excludeTotalDataChartBreakdown=true&';
      if (dataType) url += `dataType=${dataType}&`;
      
      // Remove trailing '&' or '?'
      url = url.replace(/[?&]$/, '');
      
      return this.request<OptionsDexOverview>(url);
    }
  
    /**
     * Get summary of options dex volume with historical data
     * @param protocol Protocol slug
     * @param dataType Desired data type, dailyNotionalVolume by default
     */
    async getOptionsSummary(
      protocol: string,
      dataType?: 'dailyPremiumVolume' | 'dailyNotionalVolume' | 'totalPremiumVolume' | 'totalNotionalVolume'
    ): Promise<OptionsDexData & {
      totalDataChart: Array<{ date: number; [key: string]: number }>;
    }> {
      const url = `/summary/options/${protocol}${dataType ? `?dataType=${dataType}` : ''}`;
      return this.request<OptionsDexData & {
        totalDataChart: Array<{ date: number; [key: string]: number }>;
      }>(url);
    }
  
    /**
     * Fees and Revenue Endpoints
     */
  
    /**
     * List all protocols along with summaries of their fees and revenue and dataType history data
     * @param excludeTotalDataChart True to exclude aggregated chart from response
     * @param excludeTotalDataChartBreakdown True to exclude broken down chart from response
     * @param dataType Desired data type, dailyFees by default
     */
    async getFeesOverview(
      excludeTotalDataChart?: boolean,
      excludeTotalDataChartBreakdown?: boolean,
      dataType?: 'totalFees' | 'dailyFees' | 'totalRevenue' | 'dailyRevenue'
    ): Promise<FeesOverview> {
      let url = '/overview/fees?';
      if (excludeTotalDataChart) url += 'excludeTotalDataChart=true&';
      if (excludeTotalDataChartBreakdown) url += 'excludeTotalDataChartBreakdown=true&';
      if (dataType) url += `dataType=${dataType}&`;
      
      // Remove trailing '&' or '?'
      url = url.replace(/[?&]$/, '');
      
      return this.request<FeesOverview>(url);
    }
  
    /**
     * List all protocols along with summaries of their fees and revenue and dataType history data by chain
     * @param chain Chain name, list of all supported chains can be found under allChains attribute in /overview/fees response
     * @param excludeTotalDataChart True to exclude aggregated chart from response
     * @param excludeTotalDataChartBreakdown True to exclude broken down chart from response
     * @param dataType Desired data type, dailyFees by default
     */
    async getFeesChainOverview(
      chain: string,
      excludeTotalDataChart?: boolean,
      excludeTotalDataChartBreakdown?: boolean,
      dataType?: 'totalFees' | 'dailyFees' | 'totalRevenue' | 'dailyRevenue'
    ): Promise<FeesOverview> {
      let url = `/overview/fees/${chain}?`;
      if (excludeTotalDataChart) url += 'excludeTotalDataChart=true&';
      if (excludeTotalDataChartBreakdown) url += 'excludeTotalDataChartBreakdown=true&';
      if (dataType) url += `dataType=${dataType}&`;
      
      // Remove trailing '&' or '?'
      url = url.replace(/[?&]$/, '');
      
      return this.request<FeesOverview>(url);
    }
  
    /**
     * Get summary of protocol fees and revenue with historical data
     * @param protocol Protocol slug
     * @param dataType Desired data type, dailyFees by default
     */
    async getFeesSummary(
      protocol: string,
      dataType?: 'totalFees' | 'dailyFees' | 'totalRevenue' | 'dailyRevenue'
    ): Promise<FeesData & {
      totalDataChart: Array<{ date: number; [key: string]: number }>;
    }> {
      const url = `/summary/fees/${protocol}${dataType ? `?dataType=${dataType}` : ''}`;
      return this.request<FeesData & {
        totalDataChart: Array<{ date: number; [key: string]: number }>;
      }>(url);
    }
  }
  
  // Export default instance with default configuration
  export default new DefiLlamaClient();