import { useReadContract } from "wagmi";

import { OracleABI } from "@/lib/abis/oracle.abi";

export const useOraclePrice = ({
  addressOracle,
  tokenId,
}: {
  addressOracle: HexAddress;
  tokenId: string;
}) => {
  const { data: priceOracle, isLoading } = useReadContract({
    abi: OracleABI,
    address: addressOracle as HexAddress,
    functionName: "getPrice",
    args: [BigInt(tokenId)],
  });

  const data = priceOracle && parseInt(priceOracle.toString());

  return {
    data,
    isLoading,
  };
};
