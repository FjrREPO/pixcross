import Image from "next/image";

import { cn } from "@/lib/utils";
import { useCryptoToken } from "@/hooks/query/api/use-crypto-token";

export const TokenImage = ({
  symbol,
  address,
  className,
}: {
  symbol?: string;
  address?: string;
  className?: string;
}) => {
  const fallbackImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVYS7KEXYFAwqdRCW81e4DSR_nSLYSFStx1Q&s";

  const { data } = useCryptoToken();

  const tokenLogoBySymbol =
    data && data?.find((token) => token.symbol === symbol)?.logo;

  const tokenLogoByAddress = data?.find(
    (token) =>
      address &&
      token.contract_address
        .map((addr) => addr.contract_address.toLowerCase())
        .includes(address.toLowerCase()),
  )?.logo;

  return (
    <div
      className={cn(
        "w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer",
        className,
      )}
    >
      {symbol ? (
        <Image
          alt={tokenLogoBySymbol ?? "Default alt text"}
          className={"rounded-full"}
          height={24}
          src={tokenLogoBySymbol ?? fallbackImage}
          width={24}
        />
      ) : (
        <Image
          alt={tokenLogoByAddress ?? "Default alt text"}
          className={"rounded-full"}
          height={24}
          src={tokenLogoByAddress ?? fallbackImage}
          width={24}
        />
      )}
    </div>
  );
};
