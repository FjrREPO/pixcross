import { useReadContract } from "wagmi";

import { IPAbi } from "@/lib/abis/ip.abi";

export const useTotalMintedNFT = ({
  address,
  chainId,
}: {
  address: HexAddress;
  chainId: ChainSupported;
}) => {
  const {
    data: res,
    isLoading,
    refetch,
  } = useReadContract({
    address,
    abi: IPAbi,
    functionName: "getCurrentTokenId",
    args: [],
    chainId,
    query: {
      enabled: !!address,
    },
  });

  const data = res ? Number(res as bigint) : 0;

  return { data, isLoading, refetch };
};
