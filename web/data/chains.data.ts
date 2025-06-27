export const chainMetaMap: {
  [key: number]: {
    name: string;
    symbol: string;
    icon: string;
    explorer: string;
  };
} = {
  11155111: {
    name: "Ethereum Sepolia",
    symbol: "ETH",
    icon: "https://www.cdnlogo.com/logos/e/81/ethereum-eth.svg",
    explorer: "https://sepolia.etherscan.io",
  },
  84532: {
    name: "Base Sepolia",
    symbol: "BASE",
    icon: "https://archive.org/download/github.com-base-org-withdrawer_-_2023-08-01_21-47-48/cover.jpg",
    explorer: "https://basescan.org",
  },
  421614: {
    name: "Arbitrum Sepolia",
    symbol: "ARB",
    icon: "https://holograph-static.imgix.net/arbitrum.svg?&auto=format&fit=max&w=1320",
    explorer: "https://arbiscan.io",
  },
  43113: {
    name: "Avalanche Fuji",
    symbol: "AVAX",
    icon: "/avax.png",
    explorer: "https://arbiscan.io",
  },
};

export type ChainData = {
  chainId: number;
  chainIdSelector: string;
  name: string;
  ccipName: string;
  symbol: string;
  icon: string;
  explorer: string;
};

export const chainData: ChainData[] = [
  {
    chainId: 11155111,
    chainIdSelector: "16015286601757825753",
    name: "Ethereum Sepolia",
    ccipName: "ethereum-testnet-sepolia",
    symbol: "ETH",
    icon: "https://www.cdnlogo.com/logos/e/81/ethereum-eth.svg",
    explorer: "https://sepolia.etherscan.io",
  },
  {
    chainId: 84532,
    chainIdSelector: "10344971235874465080",
    name: "Base Sepolia",
    ccipName: "ethereum-testnet-sepolia-base-1",
    symbol: "BASE",
    icon: "https://archive.org/download/github.com-base-org-withdrawer_-_2023-08-01_21-47-48/cover.jpg",
    explorer: "https://basescan.org",
  },
  {
    chainId: 421614,
    chainIdSelector: "3478487238524512106",
    name: "Arbitrum Sepolia",
    ccipName: "ethereum-testnet-sepolia-arbitrum-1",
    symbol: "ARB",
    icon: "https://holograph-static.imgix.net/arbitrum.svg?&auto=format&fit=max&w=1320",
    explorer: "https://arbiscan.io",
  },
  {
    chainId: 43113,
    chainIdSelector: "14767482510784806043",
    name: "Avalanche Fuji",
    ccipName: "avalanche-testnet-fuji",
    symbol: "AVAX",
    icon: "/avax.png",
    explorer: "https://arbiscan.io",
  },
];
