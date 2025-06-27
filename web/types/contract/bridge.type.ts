export interface BridgeConfig {
  chainSelector: string;
  bridgeContract: string;
  isActive: boolean;
  minBridgeAmount: string;
  maxBridgeAmount: string;
  bridgeFee: number;
}

export interface TokenConfig {
  isSupported: boolean;
  bridgeMode: BridgeMode;
  wrappedToken: string;
  decimals: number;
  minAmount: string;
  maxAmount: string;
  requiresWhitelist: boolean;
}

export interface NFTConfig {
  isSupported: boolean;
  bridgeMode: NFTBridgeMode;
  wrappedContract: string;
  preserveMetadata: boolean;
  requiresApproval: boolean;
  bridgeFee: number;
}

export enum BridgeMode {
  LOCK_AND_MINT = 0,
  BURN_AND_MINT = 1,
  NATIVE_TRANSFER = 2,
}

export enum NFTBridgeMode {
  LOCK_AND_MINT = 0,
  BURN_AND_MINT = 1,
  METADATA_BRIDGE = 2,
}

export enum PayFeesIn {
  Native = 0,
  LINK = 1,
}

export interface BridgeRecord {
  token: string;
  sender: string;
  receiver: string;
  amount: string;
  sourceChain: string;
  destChain: string;
  mode: BridgeMode;
  timestamp: number;
  isProcessed: boolean;
  ccipMessageId: string;
}

export interface NFTBridgeRecord {
  nftContract: string;
  tokenId: string;
  originalOwner: string;
  receiver: string;
  sourceChain: string;
  destChain: string;
  mode: NFTBridgeMode;
  timestamp: number;
  isProcessed: boolean;
  ccipMessageId: string;
  tokenURI: string;
  extraData: string;
}

const chainIdEthereumSepolia = BigInt("16015286601757825753");
const chainIdBaseSepolia = BigInt("10344971235874465080");
const chainIdArbitrumSepolia = BigInt("3478487238524512106");
const chainIdAvalancheFuji = BigInt("14767482510784806043");

export const chainSelectors = {
  11155111: chainIdEthereumSepolia,
  84532: chainIdBaseSepolia,
  421614: chainIdArbitrumSepolia,
  43113: chainIdAvalancheFuji,
};

export const chainSelectorId = {
  11155111: 0,
  84532: 1,
  421614: 2,
  43113: 3,
};
