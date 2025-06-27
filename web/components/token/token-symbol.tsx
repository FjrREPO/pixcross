import { cn } from "@/lib/utils";
import { useCryptoToken } from "@/hooks/query/api/use-crypto-token";

export const TokenSymbol = ({
  address,
  className,
}: {
  address?: string;
  className?: string;
}) => {
  const { data } = useCryptoToken();

  const tokenSymbolByAddress = data?.find(
    (token) =>
      address &&
      token.contract_address
        .map((addr) => addr.contract_address.toLowerCase())
        .includes(address.toLowerCase()),
  )?.symbol;

  return (
    <p className={cn("cursor-pointer", className)}>{tokenSymbolByAddress}</p>
  );
};
