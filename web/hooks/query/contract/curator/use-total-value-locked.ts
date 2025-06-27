import { useReadContract } from "wagmi";

import { curatorABI } from "@/lib/abis/curator.abi";

export const useTotalValueLocked = ({
  curatorAddress,
  chainId,
}: {
  curatorAddress: HexAddress;
  chainId: ChainSupported;
}) => {
  const { data, isLoading } = useReadContract({
    abi: curatorABI,
    address: curatorAddress,
    functionName: "totalAssets",
    args: [],
    chainId,
  });

  return {
    data,
    isLoading,
  };
};
