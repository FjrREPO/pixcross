import { useAccount, useReadContract } from "wagmi";

import { normalize } from "@/lib/helper/bignumber";
import { curatorABI } from "@/lib/abis/curator.abi";

export const useUserSuppliedCurator = ({
  curatorAddress,
  chainId,
  decimals = 18,
}: {
  curatorAddress: HexAddress;
  chainId: ChainSupported;
  decimals?: number;
}) => {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: curatorAddress,
    abi: curatorABI,
    functionName: "userSuppliedBalance",
    args: [address as HexAddress],
    chainId: chainId,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
      refetchOnWindowFocus: false,
    },
  });
  const dataNormalized = data
    ? Number(normalize(data.toString(), decimals))
    : "0.00";

  return {
    data,
    dataNormalized,
    isLoading,
    refetch,
  };
};
