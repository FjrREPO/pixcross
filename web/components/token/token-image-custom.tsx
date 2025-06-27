import Image from "next/image";

import { cn } from "@/lib/utils";
import { useCryptoToken } from "@/hooks/query/api/use-crypto-token";

export const TokenImageCustom = ({
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

  const tokenLogoBySymbol = data?.find(
    (token) => token.symbol === symbol,
  )?.logo;

  const tokenLogoByAddress = data?.find(
    (token) =>
      address &&
      token.contract_address.find(
        (addr) => addr.contract_address.toLowerCase() === address.toLowerCase(),
      ),
  )?.logo;

  return (
    <>
      {symbol ? (
        <Image
          alt={tokenLogoBySymbol ?? "Default alt text"}
          className={cn("rounded-full object-cover", className)}
          height={96}
          src={tokenLogoBySymbol ?? fallbackImage}
          width={96}
        />
      ) : (
        <Image
          alt={tokenLogoByAddress ?? "Default alt text"}
          className={cn("rounded-full object-cover", className)}
          height={96}
          src={tokenLogoByAddress ?? fallbackImage}
          width={96}
        />
      )}
    </>
  );
};
