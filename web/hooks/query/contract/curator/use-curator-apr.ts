import { useReadContract } from "wagmi";

import { curatorABI } from "@/lib/abis/curator.abi";

export const useCuratorAPR = ({
  curatorAddress,
  chainId,
}: {
  curatorAddress: HexAddress;
  chainId: ChainSupported;
}) => {
  const { data, isLoading } = useReadContract({
    abi: curatorABI,
    address: curatorAddress,
    functionName: "getCuratorRealtimeAPR",
    args: [],
    chainId,
  });

  return {
    data,
    isLoading,
  };
};
