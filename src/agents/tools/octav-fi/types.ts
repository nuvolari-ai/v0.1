type OctavAsset = {
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
  

  type OctavChainSummary = {
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

  type OctavProtocolPosition = {
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
  
  type OctavChain = {
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
  
  type OctavAssetByProtocols = {
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