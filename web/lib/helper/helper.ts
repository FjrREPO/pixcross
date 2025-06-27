export const urlExplorer = ({
  chainId,
  address,
  txHash,
}: {
  chainId: ChainSupported;
  address?: string;
  txHash?: string;
}) => {
  const chainMetaMap: {
    [key: number]: {
      explorer: string;
    };
  } = {
    11155111: {
      explorer: "https://sepolia.etherscan.io",
    },
    84532: {
      explorer: "https://sepolia.basescan.org",
    },
    421614: {
      explorer: "https://sepolia.arbiscan.io",
    },
    43113: {
      explorer: "https://subnets-test.avax.network/c-chain",
    },
  };

  const chainMeta = chainMetaMap[chainId];

  if (!chainMeta) return "";

  if (address) {
    return `${chainMeta.explorer}/address/${address}`;
  }

  if (txHash) {
    return `${chainMeta.explorer}/tx/${txHash}`;
  }

  return "";
};

export const formatNumber = (
  value: string | number,
  options: {
    decimals?: number;
    compact?: boolean;
    notation?: "standard" | "scientific" | "engineering" | "compact";
  } = {},
) => {
  const {
    decimals = 0,
    compact = false,
    notation = compact ? "compact" : "standard",
  } = options;

  const num = typeof value === "string" ? Number(value) : value;

  if (isNaN(num)) return "0";

  try {
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      notation,
    });

    return formatter.format(num);
  } catch {
    if (num >= 1e9) return (num / 1e9).toFixed(decimals) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(decimals) + "M";

    return num.toFixed(decimals);
  }
};

export const formatAddress = (address: string, slice?: number) => {
  return `${address.slice(0, slice || 6)}...${address.slice(-4)}`;
};
