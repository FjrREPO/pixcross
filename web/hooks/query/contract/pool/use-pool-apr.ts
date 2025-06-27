import { useReadContract } from "wagmi";

import { contractAddresses } from "@/lib/constants";
import { pixcrossAbi } from "@/lib/abis/pixcross.abi";

export const usePoolAPR = ({
  poolId,
  chainId,
}: {
  poolId: string;
  chainId: ChainSupported;
}) => {
  const { data, isLoading } = useReadContract({
    abi: pixcrossAbi,
    address: contractAddresses[chainId].pixcross as HexAddress,
    functionName: "getPoolRealtimeAPR",
    args: [poolId],
    chainId,
  });

  return {
    data,
    isLoading,
  };
};
