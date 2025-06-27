import { useReadContract } from "wagmi";

import { contractAddresses } from "@/lib/constants";
import { pixcrossAbi } from "@/lib/abis/pixcross.abi";

export const usePoolMetrics = ({
  poolId,
  chainId,
}: {
  poolId: string;
  chainId: ChainSupported;
}) => {
  const { data, isLoading } = useReadContract({
    abi: pixcrossAbi,
    address: contractAddresses[chainId].pixcross as HexAddress,
    functionName: "pools",
    args: [poolId],
    chainId,
  });

  // [ pools(bytes32) method Response ]
  // asset   address :  0xd917E2A9906D15aD68F09F4E25e150E2B7162f0E
  // gauge   address :  0x0000000000000000000000000000000000000000
  // bribe   address :  0x0000000000000000000000000000000000000000
  // index   uint256 :  0
  // gaugePeriodReward   uint256 :  0
  // gaugePeriodStart   uint256 :  0
  // totalSupplyAsset   uint256 :  49218750000
  // totalSupplyShare   uint256 :  49218750000
  // activeBalance   uint256 :  0
  // feeAccrued   uint256 :  0
  // lastAccrued   uint256 :  1749263287

  const [
    asset,
    gauge,
    bribe,
    index,
    gaugePeriodReward,
    gaugePeriodStart,
    totalSupplyAsset,
    totalSupplyShare,
    activeBalance,
    feeAccrued,
    lastAccrued,
  ] = Array.isArray(data) ? data : [];

  return {
    asset,
    gauge,
    bribe,
    index,
    gaugePeriodReward,
    gaugePeriodStart,
    totalSupplyAsset,
    totalSupplyShare,
    activeBalance,
    feeAccrued,
    lastAccrued,
    isLoading,
  };
};
