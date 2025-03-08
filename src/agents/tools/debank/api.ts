/**
 * DeBank API Client
 *
 * A TypeScript client for the DeBank Cloud API
 */

// Base interfaces
export interface ApiConfig {
    baseUrl?: string;
    accessKey: string;
  }
  
  // Chain interfaces
  export interface Chain {
    id: string;
    community_id: number;
    name: string;
    logo_url: string | null;
    native_token_id: string;
    wrapped_token_id: string;
    is_support_pre_exec: boolean;
  }
  
  // Token interface
  export interface Token {
    id: string;
    chain: string;
    name: string;
    symbol: string;
    display_symbol: string | null;
    optimized_symbol: string;
    decimals: number;
    logo_url: string | null;
    protocol_id: string;
    price: number;
    is_verified?: boolean;
    is_core?: boolean;
    is_wallet?: boolean;
    time_at: number;
  }
  
  // TokenWithAmount interface extends Token with amount fields
  export interface TokenWithAmount extends Token {
    amount: number;
    raw_amount?: number;
  }
  
  // Protocol interface
  export interface Protocol {
    id: string;
    chain: string;
    name: string;
    site_url: string;
    logo_url: string | null;
    has_supported_portfolio: boolean;
    tvl: number;
  }
  
  export interface SimpleProtocol extends Protocol {
    net_usd_value: number;
    asset_usd_value: number;
    debt_usd_value: number;
  }
  
  // Wallet/Transaction interfaces
  export interface Transaction {
    /** The ID of the chain the transaction is executed on */
    chainId: number;
    /** The address the transaction is sent from */
    from: string;
    /** The address the transaction is directed to */
    to: string;
    /** Integer of the value sent with this transaction (in hex) */
    value: string;
    /** The compiled code of a contract OR the hash of the invoked method signature and encoded parameters */
    data: string;
    /** Integer of the gas provided for the transaction execution (in hex) */
    gas?: string;
    /** Maximum amount you're willing to pay per gas unit (in hex, for EIP-1559 transactions) */
    maxFeePerGas?: string;
    /** The part of the fee that goes to the miner (in hex, for EIP-1559 transactions) */
    maxPriorityFeePerGas?: string;
    /** Integer of a nonce (in hex) */
    nonce?: string;
  }
  
  export interface TransactionExplainRequest {
    tx: Transaction;
  }
  
  // Transaction action interfaces for Explain TX API
  export interface ProtocolInfo {
    id: string;
    name: string;
    logo_url: string;
  }
  
  export interface SpenderInfo {
    id: string;
    protocol?: ProtocolInfo;
  }
  
  // NFT Collection for Explain TX API
  export interface NFTCollection {
    id: string;
    chain: string;
    name: string;
    symbol: string;
    is_core: boolean;
    time_at: number;
    collection: any | null;
  }
  
  // NFT interfaces
  export interface NFTInfo {
    id: string;
    contract_id: string;
    inner_id: string;
    name?: string;
    content_url?: string;
    thumbnail_url?: string;
    collection?: {
      chain_id: string;
      id: string;
      name: string;
      symbol?: string;
      logo_url?: string;
      is_core: boolean;
      floor_price_token?: TokenWithAmount;
      amount?: number;
    };
    amount: number;
  }
  
  export interface NFTAttribute {
    trait_type: string;
    value: string | number;
  }
  
  export interface NFTPayToken extends TokenWithAmount {
    date_at: string;
  }
  
  export interface NFT {
    id: string;
    contract_id: string;
    inner_id: string;
    chain: string;
    name: string;
    description: string;
    content_type: string;
    content: string | null;
    detail_url: string;
    contract_name: string;
    is_erc1155: boolean;
    amount: number;
    protocol?: Protocol;
    pay_token?: NFTPayToken;
    usd_price?: number;
    collection_id?: string | null;
    attributes?: NFTAttribute[];
  }
  
  // Transaction action types
  export interface SendTokenAction {
    type: 'send_token';
    from_addr: string;
    to_addr: string;
    token: Token;
  }
  
  export interface SendNFTAction {
    type: 'send_nft';
    from_addr: string;
    to_addr: string;
    nft: NFTInfo;
  }
  
  export interface ApproveTokenAction {
    type: 'approve_token';
    owner: string;
    spender: SpenderInfo;
    token: Token;
    value?: string;
  }
  
  export interface ApproveNFTAction {
    type: 'approve_nft';
    owner: string;
    spender: SpenderInfo;
    nft: NFTInfo;
  }
  
  export interface ApproveNFTCollectionAction {
    type: 'approve_nft_collection';
    owner: string;
    spender: SpenderInfo;
    collection: NFTCollection;
  }
  
  export interface RevokeTokenApprovalAction {
    type: 'revoke_token_approval';
    owner: string;
    spender: SpenderInfo;
    token: Token;
  }
  
  export interface RevokeNFTApprovalAction {
    type: 'revoke_nft_approval';
    owner: string;
    spender: SpenderInfo;
    nft: NFTInfo;
  }
  
  export interface RevokeNFTCollectionApprovalAction {
    type: 'revoke_nft_collection_approval';
    owner: string;
    spender: SpenderInfo;
    collection: NFTCollection;
  }
  
  export interface CancelTxAction {
    type: 'cancel_tx';
    from_addr: string;
  }
  
  export interface DeployContractAction {
    type: 'deploy_contract';
    from_addr: string;
  }
  
  export interface ContractInfo {
    id: string;
    protocol?: ProtocolInfo;
  }
  
  export interface CallAction {
    type: 'call';
    from_addr: string;
    to_addr: string;
    contract: ContractInfo;
  }
  
  // Union type of all supported transaction actions
  export type TransactionAction = 
    | SendTokenAction
    | SendNFTAction
    | ApproveTokenAction
    | ApproveNFTAction
    | ApproveNFTCollectionAction
    | RevokeTokenApprovalAction
    | RevokeNFTApprovalAction
    | RevokeNFTCollectionApprovalAction
    | CancelTxAction
    | DeployContractAction
    | CallAction
    | Record<string, any>; // For any future or unknown action types
  
  export interface TransactionABI {
    func: string;
    params: any[];
  }
  
  export interface TransactionExplainResponse {
    abi: TransactionABI;
    actions: TransactionAction[];
  }
  
  // User interfaces for the user module
  export interface UserChain extends Chain {
    born_at: number;
  }
  
  export interface ChainBalance {
    usd_value: number;
  }
  
  export interface TotalBalance {
    total_usd_value: number;
    chain_list: Array<Chain & { usd_value: number }>;
  }
  
  export interface NetCurvePoint {
    timestamp: number;
    usd_value: number;
  }
  
  // Transaction history interfaces
  export interface TransactionBase {
    cate_id: string;
    chain: string;
    id: string;
    project_id: string | null;
    time_at: number;
    cex_id: string | null;
    tx: {
      eth_gas_fee: number;
      from_addr: string;
      name: string;
      params: any[];
      status: number;
      to_addr: string;
      usd_gas_fee: number;
      value: number;
    };
  }
  
  export interface SendTransaction extends TransactionBase {
    sends: Array<{
      amount: number;
      to_addr: string;
      token_id: string;
    }>;
    receives: any[];
    token_approve: null;
  }
  
  export interface ReceiveTransaction extends TransactionBase {
    receives: Array<{
      amount: number;
      from_addr: string;
      token_id: string;
    }>;
    sends: any[];
    token_approve: null;
  }
  
  export interface ApproveTransaction extends TransactionBase {
    sends: any[];
    receives: any[];
    token_approve: {
      spender: string;
      token_id: string;
      value: number;
    };
    other_addr: string;
  }
  
  export type TransactionHistory = SendTransaction | ReceiveTransaction | ApproveTransaction;
  
  export interface HistoryList {
    cate_dict: Record<string, { id: string; name: string }>;
    history_list: TransactionHistory[];
    cex_dict: Record<string, {
      id: string;
      is_vault: boolean;
      logo_url: string;
      name: string;
    }>;
    project_dict: Record<string, Protocol>;
    token_dict: Record<string, Token>;
  }
  
  // Token approval interfaces
  export interface TokenApproval {
    id: string;
    name: string;
    symbol: string;
    logo_url: string;
    chain: string;
    price: number;
    balance: number;
    spenders: Array<{
      id: string;
      value: number;
      exposure_usd: number;
      protocol?: Protocol;
      is_contract: boolean;
      is_open_source?: boolean;
      is_hacked?: boolean;
      is_abandoned?: boolean;
    }>;
    sum_exposure_usd: number;
    exposure_balance: number;
  }
  
  export interface NFTApproval {
    tokens: Array<{
      id: string;
      contract_id: string;
      inner_id: string;
      chain: string;
      name: string | null;
      symbol: string;
      description: string | null;
      content_type: string | null;
      content: string | null;
      total_supply: number;
      detail_url: string;
      contract_name: string;
      is_erc721?: boolean;
      is_erc1155?: boolean;
      amount: string;
      spender: {
        id: string;
        protocol?: Protocol;
      };
    }>;
    contracts: Array<{
      chain: string;
      contract_name: string;
      contract_id: string;
      is_erc721?: boolean;
      is_erc1155?: boolean;
      amount: string;
      spender: {
        id: string;
        protocol?: Protocol;
      };
    }>;
    total: string;
  }
  
  // Portfolio interfaces - detailed implementation of PortfolioItemObject
  export interface PortfolioStats {
    asset_usd_value: number;
    debt_usd_value: number;
    net_usd_value: number;
  }
  
  export interface BasePortfolioItem {
    stats: PortfolioStats;
    update_at: number;
    name: string;
    detail_types: string[];
    proxy_detail: Record<string, any>;
    pool?: {
      controller: string;
      id: string;
      chain: string;
      project_id: string;
      position_index?: string;
    };
    asset_dict?: Record<string, number>;
    asset_token_list?: TokenWithAmount[];
    position_index?: string;
    base?: {
      user_addr: string;
      chain: string;
      project_id: string;
    };
  }
  
  // Common portfolio item
  export interface CommonPortfolioItem extends BasePortfolioItem {
    detail_types: ["common"];
    detail: {
      supply_token_list: TokenWithAmount[];
      reward_token_list?: TokenWithAmount[];
      borrow_token_list?: TokenWithAmount[];
      description?: string;
    };
  }
  
  // Locked portfolio item
  export interface LockedPortfolioItem extends BasePortfolioItem {
    detail_types: ["locked"];
    detail: {
      supply_token_list: TokenWithAmount[];
      unlock_at: number;
      reward_token_list?: TokenWithAmount[];
      description?: string;
    };
  }
  
  // Lending portfolio item
  export interface LendingPortfolioItem extends BasePortfolioItem {
    detail_types: ["lending"];
    detail: {
      supply_token_list: (TokenWithAmount & { is_collateral: boolean })[];
      borrow_token_list: TokenWithAmount[];
      reward_token_list?: TokenWithAmount[];
      health_rate?: number;
    };
  }
  
  // Leveraged farming portfolio item
  export interface LeveragedFarmingPortfolioItem extends BasePortfolioItem {
    detail_types: ["leveraged_farming"];
    detail: {
      debt_ratio: number;
      supply_token_list: TokenWithAmount[];
      borrow_token_list: TokenWithAmount[];
    };
  }
  
  // Vesting portfolio item
  export interface VestingPortfolioItem extends BasePortfolioItem {
    detail_types: ["vesting"];
    detail: {
      token: TokenWithAmount & { claimable_amount: number };
      daily_unlock_amount?: number;
      end_at?: number;
    };
  }
  
  // Reward portfolio item
  export interface RewardPortfolioItem extends BasePortfolioItem {
    detail_types: ["reward"];
    detail: {
      token_list: TokenWithAmount[];
    };
  }
  
  // Options seller portfolio item
  export interface OptionType {
    Call: "Call";
    Put: "Put";
  }
  
  export interface OptionStyle {
    American: "American";
    European: "European";
  }
  
  export interface OptionsSellerPortfolioItem extends BasePortfolioItem {
    detail_types: ["options_seller"];
    detail: {
      type: keyof OptionType;
      strike_token: TokenWithAmount;
      underlying_token: TokenWithAmount;
      collateral_token_list: TokenWithAmount[];
      style: keyof OptionStyle;
      is_auto_exercise: boolean;
      exercise_start_at?: number;
      exercise_end_at: number;
      exercise_profit: number;
      usd_value?: number;
    };
  }
  
  // Options buyer portfolio item
  export interface OptionsBuyerPortfolioItem extends BasePortfolioItem {
    detail_types: ["options_buyer"];
    detail: {
      type: keyof OptionType;
      strike_token: TokenWithAmount;
      underlying_token: TokenWithAmount;
      style: keyof OptionStyle;
      is_auto_exercise: boolean;
      exercise_start_at?: number;
      exercise_end_at: number;
      exercise_profit: number;
      usd_value?: number;
    };
  }
  
  // Insurance seller portfolio item
  export interface InsuranceSellerPortfolioItem extends BasePortfolioItem {
    detail_types: ["insurance_seller"];
    detail: {
      description: string;
      collateral_token_list: TokenWithAmount[];
      usd_value: number;
      expired_at: number;
    };
  }
  
  // Insurance buyer portfolio item
  export interface InsuranceBuyerPortfolioItem extends BasePortfolioItem {
    detail_types: ["insurance_buyer"];
    detail: {
      description: string;
      usd_value: number;
      expired_at: number;
    };
  }
  
  // Perpetuals portfolio item
  export interface PerpetualSide {
    Long: "Long";
    Short: "Short";
  }
  
  export interface PerpetualPortfolioItem extends BasePortfolioItem {
    detail_types: ["perpetuals"];
    detail: {
      description?: string;
      side: keyof PerpetualSide;
      margin_token: TokenWithAmount;
      position_token: TokenWithAmount;
      base_token: Token;
      quote_token: Token;
      daily_funding_rate: number;
      entry_price: number;
      mark_price: number;
      liquidation_price?: number;
      margin_rate: number;
      pnl_usd_value?: number;
      leverage: number;
    };
  }
  
  // NFT Common portfolio item
  export interface NFTCommonPortfolioItem extends BasePortfolioItem {
    detail_types: ["nft_common"];
    detail: {
      supply_token_list?: TokenWithAmount[];
      supply_nft_list?: NFTInfo[];
      reward_token_list?: TokenWithAmount[];
      description?: string;
    };
  }
  
  // NFT Lending portfolio item
  export interface NFTLendingPortfolioItem extends BasePortfolioItem {
    detail_types: ["nft_lending"];
    detail: {
      supply_token_list?: TokenWithAmount[];
      borrow_token_list?: TokenWithAmount[];
      supply_nft_list: NFTInfo[];
      health_rate?: number;
    };
  }
  
  // NFT Fraction portfolio item
  export interface NFTFractionPortfolioItem extends BasePortfolioItem {
    detail_types: ["nft_fraction"];
    detail: {
      share_token: TokenWithAmount;
      collection: {
        chain_id: string;
        id: string;
        name: string;
        logo_url?: string;
        is_core: boolean;
        amount: number;
      };
    };
  }
  
  // NFT P2P Borrower portfolio item
  export interface NFTP2PBorrowerPortfolioItem extends BasePortfolioItem {
    detail_types: ["nft_p2p_borrower"];
    detail: {
      supply_token_list: TokenWithAmount[];
      supply_nft_list: NFTInfo[];
      borrow_token_list: TokenWithAmount[];
      reward_token_list?: TokenWithAmount[];
    };
  }
  
  // NFT P2P Lender portfolio item
  export interface NFTP2PLenderPortfolioItem extends BasePortfolioItem {
    detail_types: ["nft_p2p_lender"];
    detail: {
      supply_token_list: TokenWithAmount[];
      nft_list: NFTInfo[];
      reward_token_list?: TokenWithAmount[];
    };
  }
  
  // Union type for all portfolio item types
  export type PortfolioItem = 
    | CommonPortfolioItem
    | LockedPortfolioItem
    | LendingPortfolioItem
    | LeveragedFarmingPortfolioItem
    | VestingPortfolioItem
    | RewardPortfolioItem
    | OptionsSellerPortfolioItem
    | OptionsBuyerPortfolioItem
    | InsuranceSellerPortfolioItem
    | InsuranceBuyerPortfolioItem
    | PerpetualPortfolioItem
    | NFTCommonPortfolioItem
    | NFTLendingPortfolioItem
    | NFTFractionPortfolioItem
    | NFTP2PBorrowerPortfolioItem
    | NFTP2PLenderPortfolioItem;
  
  export interface UserProtocol extends Protocol {
    portfolio_item_list: PortfolioItem[];
  }
  
  /**
   * DeBank API Client
   */
  export class DeBankClient {
    private baseUrl: string;
    private accessKey: string;
  
    constructor(config: ApiConfig) {
      this.baseUrl = config.baseUrl || 'https://pro-openapi.debank.com';
      this.accessKey = config.accessKey;
    }
  
    /**
     * Private helper method to make API requests with POST
     */
    private async postRequest<T>(url: string, body: any): Promise<T> {
      const headers: HeadersInit = {
        'accept': 'application/json',
        'content-type': 'application/json',
        'AccessKey': this.accessKey
      };
  
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return response.json() as Promise<T>;
    }
  
    /**
     * Helper method to make API requests
     */
    private async request<T>(url: string, baseUrl: string = this.baseUrl): Promise<T> {
      const headers: HeadersInit = {
        'accept': 'application/json',
        'AccessKey': this.accessKey
      };
  
      const response = await fetch(`${baseUrl}${url}`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return response.json() as Promise<T>;
    }
  
    /**
     * Chain Module
     */
  
    /**
     * Get specific chain information
     * @param id Chain id (e.g., 'eth', 'bsc', 'xdai')
     * @returns Chain information
     */
    async getChain(id: string): Promise<Chain> {
      return this.request<Chain>(`/v1/chain?id=${id}`);
    }
  
    /**
     * Get list of all supported chains
     * @returns Array of supported chains
     */
    async getChainList(): Promise<Chain[]> {
      return this.request<Chain[]>('/v1/chain/list');
    }
  
    /**
     * Protocol Module
     */
  
    /**
     * Get protocol information
     * @param id Protocol id (e.g., 'compound', 'uniswap', 'bsc_pancakeswap')
     * @returns Protocol information
     */
    async getProtocol(id: string): Promise<Protocol> {
      return this.request<Protocol>(`/v1/protocol?id=${id}`);
    }
  
    /**
     * Get list of protocols on a specific chain
     * @param chainId Chain id (e.g., 'eth', 'bsc', 'xdai')
     * @returns Array of protocols on the specified chain
     */
    async getProtocolList(chainId: string): Promise<Protocol[]> {
      return this.request<Protocol[]>(`/v1/protocol/list?chain_id=${chainId}`);
    }
  
    /**
     * Get list of all protocols across all supported chains or specific chains
     * @param chainIds Optional array of chain ids to filter by (e.g., ['eth', 'bsc'])
     * @returns Array of protocols
     */
    async getAllProtocolList(chainIds?: string[]): Promise<Protocol[]> {
      let url = '/v1/protocol/all_list';
      if (chainIds && chainIds.length > 0) {
        url += `?chain_ids=${chainIds.join(',')}`;
      }
      return this.request<Protocol[]>(url);
    }
  
    /**
     * Token Module
     */
  
    /**
     * Get token information
     * @param chainId Chain id (e.g., 'eth', 'bsc', 'xdai')
     * @param id Token address or native token id (e.g., 'eth', 'matic', 'bsc')
     * @returns Token information
     */
    async getToken(chainId: string, id: string): Promise<Token> {
      return this.request<Token>(`/v1/token?chain_id=${chainId}&id=${id}`);
    }
  
    /**
     * Get information for multiple tokens on a specific chain
     * @param chainId Chain id (e.g., 'eth', 'bsc', 'xdai')
     * @param ids Array of token addresses, up to 100
     * @returns Array of token information
     */
    async getTokenListByIds(chainId: string, ids: string[]): Promise<Token[]> {
      return this.request<Token[]>(`/v1/token/list_by_ids?chain_id=${chainId}&ids=${ids.join(',')}`);
    }
  
    /**
     * Get top holders of a token
     * @param chainId Chain id (e.g., 'eth', 'bsc', 'xdai')
     * @param id Token address or native token id
     * @param start Offset (default: 0, max: 10000)
     * @param limit Limit (default: 100, max: 100)
     * @returns Array of [address, amount] pairs
     */
    async getTokenTopHolders(
      chainId: string, 
      id: string, 
      start = 0, 
      limit = 100
    ): Promise<Array<[string, number]>> {
      return this.request<Array<[string, number]>>(
        `/v1/token/top_holders?chain_id=${chainId}&id=${id}&start=${start}&limit=${limit}`
      );
    }
  
    /**
     * Get token historical price
     * @param chainId Chain id (e.g., 'eth', 'bsc', 'xdai')
     * @param id Token address or native token id
     * @param dateAt UTC date in format YYYY-MM-DD
     * @returns Price information
     */
    async getTokenHistoryPrice(chainId: string, id: string, dateAt: string): Promise<{ price: number }> {
      return this.request<{ price: number }>(
        `/v1/token/history_price?chain_id=${chainId}&id=${id}&date_at=${dateAt}`
      );
    }
  
    /**
     * User Module
     */
  
    /**
     * Get user's used chains
     * @param id User address
     * @returns Array of chains the user has used
     */
    async getUserUsedChains(id: string): Promise<UserChain[]> {
      return this.request<UserChain[]>(`/v1/user/used_chain_list?id=${id}`);
    }
  
    /**
     * Get user's balance on a specific chain
     * @param id User address
     * @param chainId Chain id
     * @returns Chain balance information
     */
    async getUserChainBalance(id: string, chainId: string): Promise<ChainBalance> {
      return this.request<ChainBalance>(`/v1/user/chain_balance?id=${id}&chain_id=${chainId}`);
    }
  
    /**
     * Get user's portfolio in a specific protocol
     * @param id User address
     * @param protocolId Protocol id
     * @returns Protocol with user's portfolio
     */
    async getUserProtocol(id: string, protocolId: string): Promise<UserProtocol> {
      return this.request<UserProtocol>(`/v1/user/protocol?id=${id}&protocol_id=${protocolId}`);
    }
  
    /**
     * Get user's detailed portfolio on a specific chain
     * @param id User address
     * @param chainId Chain id
     * @returns Array of protocols with detailed portfolio
     */
    async getUserComplexProtocolList(id: string, chainId: string): Promise<UserProtocol[]> {
      return this.request<UserProtocol[]>(`/v1/user/complex_protocol_list?id=${id}&chain_id=${chainId}`);
    }
  
    /**
     * Get user's detailed portfolio across all chains or specific chains
     * @param id User address
     * @param chainIds Optional array of chain ids
     * @returns Array of protocols with detailed portfolio
     */
    async getUserAllComplexProtocolList(id: string, chainIds?: string[]): Promise<UserProtocol[]> {
      let url = `/v1/user/all_complex_protocol_list?id=${id}`;
      if (chainIds && chainIds.length > 0) {
        url += `&chain_ids=${chainIds.join(',')}`;
      }
      return this.request<UserProtocol[]>(url);
    }
  
    /**
     * Get user's simple portfolio on a specific chain
     * @param id User address
     * @param chainId Chain id
     * @returns Array of protocols with simple portfolio
     */
    async getUserSimpleProtocolList(id: string, chainId: string): Promise<SimpleProtocol[]> {
      return this.request<SimpleProtocol[]>(`/v1/user/simple_protocol_list?id=${id}&chain_id=${chainId}`);
    }
  
    /**
     * Get user's simple portfolio across all chains or specific chains
     * @param id User address
     * @param chainIds Optional array of chain ids
     * @returns Array of protocols with simple portfolio
     */
    async getUserAllSimpleProtocolList(id: string, chainIds?: string[]): Promise<SimpleProtocol[]> {
      let url = `/v1/user/all_simple_protocol_list?id=${id}`;
      if (chainIds && chainIds.length > 0) {
        url += `&chain_ids=${chainIds.join(',')}`;
      }
      return this.request<SimpleProtocol[]>(url);
    }
  
    /**
     * Get user's token on a specific chain
     * @param id User address
     * @param chainId Chain id
     * @param tokenId Token id
     * @returns Token with amount information
     */
    async getUserToken(id: string, chainId: string, tokenId: string): Promise<TokenWithAmount> {
      return this.request<TokenWithAmount>(
        `/v1/user/token?id=${id}&chain_id=${chainId}&token_id=${tokenId}`
      );
    }
  
    /**
     * Get user's token list on a specific chain
     * @param id User address
     * @param chainId Chain id
     * @param isAll Whether to include all tokens (true) or only core tokens (false), default is true
     * @returns Array of tokens with amounts
     */
    async getUserTokenList(id: string, chainId: string, isAll = true): Promise<TokenWithAmount[]> {
      return this.request<TokenWithAmount[]>(
        `/v1/user/token_list?id=${id}&chain_id=${chainId}&is_all=${isAll}`
      );
    }
  
    /**
     * Get user's token list across all chains or specified chains
     * @param id User address
     * @param isAll Whether to include all tokens, default is true
     * @param chainIds Optional array of chain ids
     * @returns Array of tokens with amounts
     */
    async getUserAllTokenList(
      id: string, 
      isAll = true, 
      chainIds?: string[]
    ): Promise<TokenWithAmount[]> {
      let url = `/v1/user/all_token_list?id=${id}&is_all=${isAll}`;
      if (chainIds && chainIds.length > 0) {
        url += `&chain_ids=${chainIds.join(',')}`;
      }
      return this.request<TokenWithAmount[]>(url);
    }
  
    /**
     * Get user's NFT list on a specific chain
     * @param id User address
     * @param chainId Chain id
     * @param isAll Whether to include all NFTs, default is true
     * @returns Array of NFTs
     */
    async getUserNFTList(id: string, chainId: string, isAll = true): Promise<NFT[]> {
      return this.request<NFT[]>(
        `/v1/user/nft_list?id=${id}&chain_id=${chainId}&is_all=${isAll}`
      );
    }
  
    /**
     * Get user's NFT list across all chains or specified chains
     * @param id User address
     * @param isAll Whether to include all NFTs, default is true
     * @param chainIds Optional array of chain ids
     * @returns Array of NFTs
     */
    async getUserAllNFTList(
      id: string, 
      isAll = true, 
      chainIds?: string[]
    ): Promise<NFT[]> {
      let url = `/v1/user/all_nft_list?id=${id}&is_all=${isAll}`;
      if (chainIds && chainIds.length > 0) {
        url += `&chain_ids=${chainIds.join(',')}`;
      }
      return this.request<NFT[]>(url);
    }
  
    /**
     * Get user's transaction history on a specific chain
     * @param id User address
     * @param chainId Chain id
     * @param tokenId Optional token id to filter by
     * @param startTime Optional timestamp to start from
     * @param pageCount Optional number of entries to return, max 20
     * @returns History list
     */
    async getUserHistoryList(
      id: string, 
      chainId: string,
      tokenId?: string,
      startTime?: number,
      pageCount?: number
    ): Promise<HistoryList> {
      let url = `/v1/user/history_list?id=${id}&chain_id=${chainId}`;
      if (tokenId) url += `&token_id=${tokenId}`;
      if (startTime) url += `&start_time=${startTime}`;
      if (pageCount) url += `&page_count=${pageCount}`;
      return this.request<HistoryList>(url);
    }
  
    /**
     * Get user's transaction history across all chains or specified chains
     * @param id User address
     * @param startTime Optional timestamp to start from
     * @param pageCount Optional number of entries to return, max 20
     * @param chainIds Optional array of chain ids
     * @returns History list
     */
    async getUserAllHistoryList(
      id: string,
      startTime?: number,
      pageCount?: number,
      chainIds?: string[]
    ): Promise<HistoryList> {
      let url = `/v1/user/all_history_list?id=${id}`;
      if (startTime) url += `&start_time=${startTime}`;
      if (pageCount) url += `&page_count=${pageCount}`;
      if (chainIds && chainIds.length > 0) {
        url += `&chain_ids=${chainIds.join(',')}`;
      }
      return this.request<HistoryList>(url);
    }
  
    /**
     * Get user's token authorization list on a specific chain
     * @param id User address
     * @param chainId Chain id
     * @returns Array of token approvals
     */
    async getUserTokenAuthorizedList(id: string, chainId: string): Promise<TokenApproval[]> {
      return this.request<TokenApproval[]>(`/v1/user/token_authorized_list?id=${id}&chain_id=${chainId}`);
    }
  
    /**
     * Get user's NFT authorization list on a specific chain
     * @param id User address
     * @param chainId Chain id
     * @returns NFT approvals
     */
    async getUserNFTAuthorizedList(id: string, chainId: string): Promise<NFTApproval> {
      return this.request<NFTApproval>(`/v1/user/nft_authorized_list?id=${id}&chain_id=${chainId}`);
    }
  
    /**
     * Get user's total balance across all supported chains
     * @param id User address
     * @returns Total balance information
     */
    async getUserTotalBalance(id: string): Promise<TotalBalance> {
      return this.request<TotalBalance>(`/v1/user/total_balance?id=${id}`);
    }
  
    /**
     * Get user's 24-hour net curve on a specific chain
     * @param id User address
     * @param chainId Chain id
     * @returns Array of time-value points
     */
    async getUserChainNetCurve(id: string, chainId: string): Promise<NetCurvePoint[]> {
      return this.request<NetCurvePoint[]>(`/v1/user/chain_net_curve?id=${id}&chain_id=${chainId}`);
    }
  
    /**
     * Get user's 24-hour net curve across all chains or specified chains
     * @param id User address
     * @param chainIds Optional array of chain ids
     * @returns Array of time-value points
     */
    async getUserTotalNetCurve(id: string, chainIds?: string[]): Promise<NetCurvePoint[]> {
      let url = `/v1/user/total_net_curve?id=${id}`;
      if (chainIds && chainIds.length > 0) {
        url += `&chain_ids=${chainIds.join(',')}`;
      }
      return this.request<NetCurvePoint[]>(url);
    }
  
    /**
     * Wallet Module
     */
  
    /**
     * Explain a transaction by decoding its ABI and determining actions
     * @param tx Transaction object with chain ID, from/to addresses, value, and data
     * @returns Explanation of transaction including ABI and actions
     */
    async explainTransaction(tx: Transaction): Promise<TransactionExplainResponse> {
      return this.postRequest<TransactionExplainResponse>('/v1/wallet/explain_tx', { tx });
    }
  }
  
  // Export default instance creator function
  export const createDeBankClient = (accessKey: string, baseUrl?: string) => {
    return new DeBankClient({ accessKey, baseUrl });
  };