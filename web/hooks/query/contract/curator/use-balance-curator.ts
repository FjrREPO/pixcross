import { useAccount, useReadContract } from "wagmi";

import { normalize } from "@/lib/helper/bignumber";
import { pixcrossCuratorFactoryABI } from "@/lib/abis/pixcross-curator-factory.abi";

export const useBalanceCurator = ({
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
    abi: pixcrossCuratorFactoryABI,
    functionName: "maxWithdraw",
    args: [address as HexAddress],
    chainId: chainId,
    query: {
      enabled: !!address,
    },
  });
  const dataNormalized = data
    ? Number(normalize(data.toString(), decimals))
    : 0;

  return {
    data,
    dataNormalized,
    isLoading,
    refetch,
  };
};
