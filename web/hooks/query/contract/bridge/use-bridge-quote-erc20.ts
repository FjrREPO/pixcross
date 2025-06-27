import { useReadContract } from "wagmi";
import { parseUnits } from "viem";

import { contractAddresses } from "@/lib/constants";
import { pixcrossBridgeERC20ABI } from "@/lib/abis/pixcross-bridge-erc20.abi";
import { chainSelectorId, PayFeesIn } from "@/types/contract/bridge.type";
import { valueToBigInt } from "@/lib/helper/bignumber";

export const useBridgeQuoteERC20 = ({
  tokenAddress,
  amount,
  chainId,
  destChainId,
  decimals = 18,
  enabled = true,
}: {
  tokenAddress: HexAddress;
  destChainId: ChainSupported;
  amount: string;
  chainId: ChainSupported;
  decimals?: number;
  enabled?: boolean;
}) => {
  const shouldFetch =
    enabled && tokenAddress && amount && parseFloat(amount) > 0 && destChainId;

  const amountInWei = shouldFetch ? parseUnits(amount, decimals) : BigInt(0);

  const tokenId =
    tokenAddress === contractAddresses[chainId]?.usdt
      ? 1
      : tokenAddress === contractAddresses[chainId].usdc
        ? 0
        : 2;

  const chainIdSelector = chainSelectorId[destChainId];

  const {
    data: quoteData,
    error,
    isLoading,
    refetch,
  } = useReadContract({
    abi: pixcrossBridgeERC20ABI,
    address: contractAddresses[chainId]?.pixcrossBridgeERC20 as HexAddress,
    functionName: "getEstimatedFees",
    args: shouldFetch
      ? [
          BigInt(chainIdSelector),
          BigInt(tokenId),
          amountInWei,
          valueToBigInt(PayFeesIn.Native),
        ]
      : undefined,
    chainId,
    query: {
      enabled: !!shouldFetch,
      refetchInterval: 30000,
      staleTime: 10000,
      retry: (failureCount, error) => {
        if (error?.message?.includes("UnsupportedToken")) {
          return false;
        }

        return failureCount < 3;
      },
    },
  });

  const processedQuote = quoteData
    ? {
        totalFee: (quoteData as any)[0] as bigint,
        protocolFee: (quoteData as any)[1] as bigint,
        ccipFee: (quoteData as any)[2] as bigint,
      }
    : null;

  return {
    data: processedQuote,
    isLoading,
    error,
    refetch,
  };
};
