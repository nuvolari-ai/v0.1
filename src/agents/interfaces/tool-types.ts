/**
 * Octav API Types
 */

export type OctavAsset = {
  balance: string;
  chainContract: string;
  chainKey: string;
  contract: string;
  decimal: string;
  name: string;
  openPnl: string;
  price: string;
  symbol: string;
  totalCostBasis: string;
  value: string;
  imgSmall: string;
  imgLarge: string;
  explorerUrl: string;
}

export type OctavChainSummary = {
  name: string;
  key: string;
  chainId: string;
  value: string;
  valuePercentile: string;
  totalCostBasis: string;
  totalClosedPnl: string;
  totalOpenPnl: string;
  imgSmall: string;
  imgLarge: string;
}

export type OctavProtocolPosition = {
  name: string;
  totalOpenPnl: string;
  totalCostBasis: string;
  totalValue: string;
  unlockAt: string; // timestamp
  imgSmall: string;
  imgLarge: string;
  explorerUrl: string;
  assets: OctavAsset[];
  supplyAssets: OctavAsset[];
  borrowAssets: OctavAsset[];
  rewardAssets: OctavAsset[];
  dexAssets: OctavAsset[];
  protocolPositions: OctavProtocolPosition[]; // For complex protocols
}

export type OctavChain = {
  name: string;
  key: string;
  value: string;
  totalCostBasis: string;
  totalClosedPnl: string;
  totalOpenPnl: string;
  imgSmall: string;
  imgLarge: string;
  ProtocolPosition: Record<string, OctavProtocolPosition>;
}

export type OctavAssetByProtocols = {
  name: string;
  key: string;
  value: string;
  totalCostBasis: string;
  totalClosedPnl: string;
  totalOpenPnl: string;
  imgSmall: string;
  imgLarge: string;
  Chains: Record<string, OctavChain>;
}

export type OctavPortfolio = {
  address: string;
  cashBalance: string;
  closedPnl: string;
  dailyIncome: string;
  dailyExpense: string;
  fees: string;
  feesFiat: string;
  lastUpdated: string; // timestamp in milliseconds since epoch
  openPnl: string;
  networth: string;
  totalCostBasis: string;
  assetByProtocols: Record<string, OctavAssetByProtocols>; 
  chains: Record<string, OctavChainSummary>; 
}

/**
 * DefiLlama API Types
 */

// Base interfaces
export interface ApiConfig {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
}

// Common response types
export interface ProtocolTvl {
  TVL: number;
  tokenSymbol?: string;
  tokensInUsd?: number;
  tokens?: number;
  token?: string;
  tokenPrice?: number;
  tvlPrevDay?: number;
  tvlPrevWeek?: number;
  tvlPrevMonth?: number;
}

export interface ChainTvl {
  tvl: number;
  tvlPrevDay?: number;
  tvlPrevWeek?: number;
  tvlPrevMonth?: number;
}

export interface HistoricalTvlData {
  date: number;
  totalLiquidityUSD: number;
}

export interface ProtocolData {
  id: string;
  name: string;
  address?: string;
  symbol?: string;
  url?: string;
  description?: string;
  chain: string;
  logo?: string;
  category?: string;
  chains: string[];
  tvl: number;
  change_1h?: number;
  change_1d?: number;
  change_7d?: number;
  mcap?: number;
}

export interface CoinPrice {
  decimals: number;
  symbol: string;
  price: number;
  timestamp: number;
  confidence: number;
}

export interface CurrentPricesResponse {
  coins: Record<string, CoinPrice>;
}

export interface HistoricalPrice extends CoinPrice {
  timestamp: number;
}

export interface ChartPrice {
  price: number;
  timestamp: number;
}

export interface PriceChartResponse {
  prices: ChartPrice[];
  symbol: string;
  decimals: number;
  confidence: number;
}

export interface PricePercentageResponse {
  coins: Record<string, { [timeframe: string]: number }>;
}

export interface FirstPriceResponse {
  coins: Record<string, { 
    symbol: string;
    price: number;
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
  circulating: number;
  pegDeviation: number;
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
  apyBase?: number;
  apyReward?: number;
  apy: number;
  rewardTokens?: string[];
  underlyingTokens?: string[];
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
  timestamp: number;
}

export interface DexData extends VolumeData {
  name: string;
  disabled?: boolean;
}

export interface DexOverview {
  name: string;
  disabled?: boolean;
  chains: string[];
  change_1d: number;
  change_7d: number;
  change_1m: number;
  change_7dover7d: number;
  change_30dover30d: number;
  totalVolume: number;
  dailyVolume: number;
  monthlyVolume: number;
}

export interface OptionsDexData extends VolumeData {
  name: string;
  totalNotionalVolume: number;
  totalPremiumVolume: number;
  dailyNotionalVolume: number;
  dailyPremiumVolume: number;
}

export interface OptionsDexOverview {
  name: string;
}

// Fees and Revenue interfaces
export interface FeesData {
  totalFees: number;
  dailyFees: number;
  totalRevenue: number;
  dailyRevenue: number;
  timestamp: number;
}

export interface FeesOverview {
  name: string;
  disabled?: boolean;
  chains: string[];
  change_1d: number;
  change_7d: number;
  change_1m: number;
  change_7dover7d: number;
  change_30dover30d: number;
  total24h: number;
  total48hto24h: number;
  total7d: number;
  total30d: number;
  total90d: number;
  total180d: number;
  totalAllTime: number;
} 