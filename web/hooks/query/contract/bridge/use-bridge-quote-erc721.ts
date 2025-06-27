import { useReadContract } from "wagmi";

import { contractAddresses } from "@/lib/constants";
import { pixcrossBridgeERC721ABI } from "@/lib/abis/pixcross-bridge-erc721.abi";
import { valueToBigInt } from "@/lib/helper/bignumber";

export const useBridgeQuoteERC721 = ({
  tokenAddress,
  destChainId,
  chainId,
  enabled = true,
}: {
  tokenAddress: HexAddress;
  destChainId: ChainSupported;
  chainId: ChainSupported;
  enabled?: boolean;
}) => {
  const shouldFetch = enabled && tokenAddress && destChainId;
  const {
    data: quote,
    error,
    isLoading,
    refetch,
  } = useReadContract({
    abi: pixcrossBridgeERC721ABI,
    address: contractAddresses[chainId].pixcrossBridgeERC721 as HexAddress,
    functionName: "getBridgeQuote",
    args: shouldFetch
      ? [tokenAddress, valueToBigInt(1), valueToBigInt(destChainId)]
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

  const data = quote as bigint | undefined;

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
