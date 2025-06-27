import {
  ETHEREUM_SEPOLIA_RPC_URL,
  BASE_SEPOLIA_RPC_URL,
  ARBITRUM_SEPOLIA_RPC_URL,
  AVALANCHE_FUJI_RPC_URL,
} from './rpc';
import {
  SUBGRAPH_ETH_SEPOLIA_URL,
  SUBGRAPH_BASE_SEPOLIA_URL,
  SUBGRAPH_ARB_SEPOLIA_URL,
  SUBGRAPH_AVAX_FUJI_URL,
} from './subgraph';

export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  subgraphUrl: string;
  bridgeAddress: string;
}

export const SUPPORTED_CHAINS: Record<number, ChainConfig> = {
  11155111: {
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    rpcUrl: process.env.ETHEREUM_SEPOLIA_RPC_URL || ETHEREUM_SEPOLIA_RPC_URL,
    subgraphUrl: process.env.SUBGRAPH_ETH_SEPOLIA_URL || SUBGRAPH_ETH_SEPOLIA_URL,
    bridgeAddress: process.env.ETH_SEPOLIA_BRIDGE_ADDRESS || '',
  },
  84532: {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || BASE_SEPOLIA_RPC_URL,
    subgraphUrl: process.env.SUBGRAPH_BASE_SEPOLIA_URL || SUBGRAPH_BASE_SEPOLIA_URL,
    bridgeAddress: process.env.BASE_SEPOLIA_BRIDGE_ADDRESS || '',
  },
  421614: {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    rpcUrl: process.env.ARBITRUM_SEPOLIA_RPC_URL || ARBITRUM_SEPOLIA_RPC_URL,
    subgraphUrl: process.env.SUBGRAPH_ARB_SEPOLIA_URL || SUBGRAPH_ARB_SEPOLIA_URL,
    bridgeAddress: process.env.ARB_SEPOLIA_BRIDGE_ADDRESS || '',
  },
  43113: {
    chainId: 43113,
    name: 'Avalanche Fuji',
    rpcUrl: process.env.AVALANCHE_FUJI_RPC_URL || AVALANCHE_FUJI_RPC_URL,
    subgraphUrl: process.env.SUBGRAPH_AVAX_FUJI_URL || SUBGRAPH_AVAX_FUJI_URL,
    bridgeAddress: process.env.AVAX_FUJI_BRIDGE_ADDRESS || '',
  },
};

export const getChainConfig = (chainId: number): ChainConfig | undefined => {
  return SUPPORTED_CHAINS[chainId];
};

export const getAllChainConfigs = (): ChainConfig[] => {
  return Object.values(SUPPORTED_CHAINS);
};

export const getTargetChainConfig = (sourceChainId: number, targetChainId: number): ChainConfig | undefined => {
  return getChainConfig(targetChainId);
};

