import { getAddress } from "viem";

export interface NetworkModel {
    id: number;
    name: string;
    isConnected?: boolean;
  }
  
  export interface PriceModel {
    decimals: number;
    price: number;
    address: string;
    symbol: string;
    timestamp: number;
    chainId: number;
  }
  
  export interface TransactionModel {
    data: string;
    to: string;
    from: string;
    value: string;
  }
  
  export interface HopModel {
    tokenIn: string[];
    tokenOut: string[];
    protocol: string;
    action: string;
    primary: string;
    internalRoutes: string[];
  }
  
  export interface RouteShortcutTransactionModel {
    gas: string;
    amountOut: Record<string, any>;
    priceImpact: number;
    feeAmount: string[];
    createdAt: number;
    tx: TransactionModel;
    route: HopModel[];
  }
  
  export interface RouteShortcutVariableInputsModel {
    chainId?: number;
    fromAddress: string;
    routingStrategy?: 'ensowallet' | 'router' | 'delegate' | null;
    toEoa?: boolean | null;
    receiver?: string;
    spender?: string;
    amountIn: string[];
    minAmountOut?: string[] | null;
    slippage?: string;
    fee?: string[];
    feeReceiver?: string;
    ignoreAggregators?: string[] | null;
    ignoreStandards?: string[] | null;
    tokenIn: string[];
    tokenOut: string[];
    variableEstimates: Record<string, any> | null;
  }
  
  export interface WalletApproveTransactionModel {
    tx: TransactionModel;
    gas: string;
    token: string;
    amount: string;
    spender: string;
  }
  
  export interface WalletBalanceModel {
    token: string;
    amount: string;
    decimals: number;
    price: string;
  }
  
  export interface TokenModel {
    address: string;
    chainId: number;
    type: string;
    decimals: number;
    symbol: string | null;
    name: string | null;
    logosUri: string[] | null;
  }
  
  export interface PositionModel extends TokenModel {
    underlyingTokens: TokenModel[] | null;
    protocolSlug: string | null;
    apy: number | null;
    tvl: number | null;
    primaryAddress: string | null;
  }
  
  export interface ActionModel {
    action: string;
    inputs: Record<string, string>;
  }
  
  export interface ProtocolModel {
    slug: string;
    name: string | null;
    description: string | null;
    url: string | null;
    logosUri: string[] | null;
    chains: NetworkModel[] | null;
  }
  
  export interface StandardActionModel {
    action: string;
    name: string;
    functionNames: string[];
    supportedChains: NetworkModel[];
    inputs: string[];
  }
  
  export interface StandardModel {
    protocol: {
      slug: string;
      url: string;
    };
    forks: {
      slug: string;
      url: string;
    }[];
    actions: StandardActionModel[];
  }
  
  export interface ActionToBundleModel {
    protocol: string[];
    action: string;
    args: Record<string, any>;
  }
  
  export interface BundleShortcutTransactionModel {
    bundle: ActionToBundleModel[];
    gas: string;
    createdAt: number;
    tx: TransactionModel;
  }
  
  export interface QuoteModel {
    gas: string;
    amountOut: Record<string, any>;
    priceImpact: number;
    feeAmount: string[];
  }
  
  export interface StepModel {
    tokenIn: string;
    tokenOut: string;
    protocol: string;
    action: string;
    primary: string;
  }
  
  export interface SimplePathModel {
    amountIn: string;
    path: StepModel[];
  }
  
  export interface QuoteRouteInputsModel {
    chainId?: number;
    fromAddress?: string;
    routingStrategy?: 'ensowallet' | 'router' | 'delegate' | null;
    route: SimplePathModel[];
    fee?: string[];
    feeReceiver?: string;
    ignoreAggregators?: string[] | null;
    blockNumber?: string;
  }
  
  export interface IporShortcutInputModel {
    isRouter?: boolean | null;
    amountIn: string;
    tokenIn: string;
    tokenBToBuy: string;
    percentageForTokenB: string;
    slippage?: string;
    simulate?: boolean | null;
  }
  
  export interface IporShortcutTransactionModel {
    createdAt: number;
    tx: TransactionModel;
    logs: string[];
    simulationURL: string;
  }
  
  export interface PaginationMetaModel {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number;
    next: number;
  }
  
  export interface PaginatedResultModel<T> {
    meta: PaginationMetaModel;
    data: T[];
  }
  

/**
 * EnsoAPIClient - TypeScript client for the Enso API
 */
  export class EnsoAPIClient {
    private readonly baseUrl: string;
    private readonly apiKey: string;
  
    /**
     * Create a new EnsoAPIClient
     * @param apiKey Your Enso API key
     * @param baseUrl Base URL for the API (default: 'https://api.enso.finance')
     */
    constructor(apiKey: string, baseUrl = 'https://api.enso.finance') {
      this.baseUrl = baseUrl;
      this.apiKey = apiKey;
    }
  
    /**
     * Helper method to build the request headers
     */
    getHeaders(): HeadersInit {
      return {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };
    }
  
    /**
     * Helper method to build query parameters
     */
    private buildQueryParams(params: Record<string, any>): string {
      const filteredParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return value.map(v => `${key}=${encodeURIComponent(v)}`).join('&');
          }
          return `${key}=${encodeURIComponent(value)}`;
        });
  
      return filteredParams.length > 0 ? `?${filteredParams.join('&')}` : '';
    }
  
    /**
     * Helper method to make API requests
     */
    async request<T>(
      endpoint: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
      params: Record<string, any> = {},
      body?: any
    ): Promise<T> {
      const url = `${this.baseUrl}${endpoint}${method === 'GET' ? this.buildQueryParams(params) : ''}`;
      
      const options: RequestInit = {
        method,
        headers: this.getHeaders(),
      };
  
      if (body) {
        options.body = JSON.stringify(body);
      }
  
      if (method === 'POST' && params && Object.keys(params).length > 0) {
        const queryString = this.buildQueryParams(params);
        const urlWithParams = `${url}${queryString.startsWith('?') ? queryString : `?${queryString}`}`;
        
        const response = await fetch(urlWithParams, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
        }
        
        return await response.json() as T;
      }
  
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
      }
      
      return await response.json() as T;
    }

    safeAddress(address: string): string {
      try {
        return getAddress(address);
      } catch (error) {
        if (address === 'sonic') {
          return '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
        }
        return address;
      }
    }
  
    /**
     * Returns networks supported by the API
     */
    async getNetworks(params: { name?: string; chainId?: string } = {}): Promise<NetworkModel[]> {
      return this.request<NetworkModel[]>('/api/v1/networks', 'GET', params);
    }
  
    /**
     * Returns price for a token
     */
    async getPrice(chainId: string, address: string): Promise<PriceModel> {
      return this.request<PriceModel>(`/api/v1/prices/${chainId}/${address}`);
    }
  
    /**
     * Returns aggregators supported by the API
     */
    async getAggregators(): Promise<string[]> {
      return this.request<string[]>('/api/v1/aggregators');
    }
  
    /**
     * Returns chain USD volume and total transactions
     */
    async getVolume(chainId: number): Promise<any> {
      return this.request<any>(`/api/v1/volume/${chainId}`);
    }
  
    /**
     * Best route from a token to another (GET)
     */
    async getRouteShortcutTransaction(params: {
      chainId?: number;
      fromAddress: string;
      routingStrategy?: 'ensowallet' | 'router' | 'delegate';
      toEoa?: boolean;
      receiver?: string;
      spender?: string;
      amountIn: string[];
      minAmountOut?: string[];
      slippage?: string;
      fee?: string[];
      feeReceiver?: string;
      ignoreAggregators?: string[];
      ignoreStandards?: string[];
      tokenIn: string[];
      tokenOut: string[];
    }): Promise<RouteShortcutTransactionModel> {
      return this.request<RouteShortcutTransactionModel>('/api/v1/shortcuts/route', 'GET', params);
    }
  
    /**
     * Best route from a token to another (POST)
     */
    async postRouteShortcutTransaction(
      body: RouteShortcutVariableInputsModel
    ): Promise<RouteShortcutTransactionModel> {
      return this.request<RouteShortcutTransactionModel>('/api/v1/shortcuts/route', 'POST', {}, body);
    }
  
    /**
     * Returns transaction that approves your EnsoWallet to spend tokens
     */
    async createApproveTransaction(params: {
      chainId?: number;
      fromAddress: string;
      routingStrategy?: 'ensowallet' | 'router' | 'delegate';
      tokenAddress: string;
      amount: string;
    }): Promise<WalletApproveTransactionModel> {
      return this.request<WalletApproveTransactionModel>('/api/v1/wallet/approve', 'GET', params);
    }
  
    /**
     * Returns all balances for a given wallet
     */
    async getWalletBalances(params: {
      chainId?: number;
      eoaAddress: string;
      useEoa: boolean;
    }): Promise<WalletBalanceModel[]> {
      return this.request<WalletBalanceModel[]>('/api/v1/wallet/balances', 'GET', params);
    }
  
    /**
     * Returns tokens and their details
     */
    async getTokens(params: {
      protocolSlug?: string;
      underlyingTokens?: string[];
      underlyingTokensExact?: string[];
      primaryAddress?: string[];
      address?: string[];
      chainId?: number;
      type?: 'defi' | 'base';
      page?: number;
      includeMetadata?: boolean;
      apyFrom?: number;
      apyTo?: number;
      tvlFrom?: number;
      tvlTo?: number;
    } = {}): Promise<PaginatedResultModel<PositionModel>> {
      return this.request<PaginatedResultModel<PositionModel>>('/api/v1/tokens', 'GET', params);
    }
  
    /**
     * Returns actions available to use in bundle shortcuts
     */
    async getActions(): Promise<ActionModel[]> {
      return this.request<ActionModel[]>('/api/v1/actions');
    }
  
    /**
     * Returns standards and methods available to use in bundle shortcuts
     */
    async getStandards(): Promise<StandardModel[]> {
      return this.request<StandardModel[]>('/api/v1/standards');
    }
  
    /**
     * Bundle a list of actions into a single tx
     */
    async bundleShortcutTransaction(
      params: {
        chainId?: number;
        fromAddress: string;
        routingStrategy?: 'delegate';
        receiver?: string;
        spender?: string;
      },
      body: ActionToBundleModel[]
    ): Promise<BundleShortcutTransactionModel> {
      return this.request<BundleShortcutTransactionModel>('/api/v1/shortcuts/bundle', 'POST', params, body);
    }
  
    /**
     * Quote from a token to another (GET)
     */
    async getQuote(params: {
      chainId?: number;
      fromAddress?: string;
      routingStrategy?: 'ensowallet' | 'router' | 'delegate';
      tokenIn: string[];
      tokenOut: string[];
      amountIn: string[];
      fee?: string[];
      feeReceiver?: string;
      ignoreAggregators?: string[];
      ignoreStandards?: string[];
    }): Promise<QuoteModel> {
      return this.request<QuoteModel>('/api/v1/shortcuts/quote', 'GET', params);
    }
  
    /**
     * Simulate a route (POST)
     */
    async quoteMultipath(body: QuoteRouteInputsModel): Promise<QuoteModel> {
      return this.request<QuoteModel>('/api/v1/shortcuts/quote', 'POST', {}, body);
    }
  
    /**
     * Get transaction for IPOR shortcut
     */
    async iporShortcutTransaction(
      params: {
        chainId?: number;
        fromAddress: string;
      },
      body: IporShortcutInputModel
    ): Promise<IporShortcutTransactionModel> {
      return this.request<IporShortcutTransactionModel>('/api/v1/shortcuts/static/ipor', 'POST', params, body);
    }
  
    /**
     * Returns projects and relevant protocols available to use in bundle shortcuts
     */
    async getProtocols(params: { slug?: string } = {}): Promise<ProtocolModel[]> {
      return this.request<ProtocolModel[]>('/api/v1/protocols', 'GET', params);
    }
  }