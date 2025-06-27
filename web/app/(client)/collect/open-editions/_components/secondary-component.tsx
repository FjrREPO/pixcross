"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Infinity } from "lucide-react";

import { NFTMetadataType } from "@/types/api/nft-metadata.type";
import { useTotalMintedNFT } from "@/hooks/query/contract/erc721/use-total-minted-nft";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { urlExplorer } from "@/lib/helper/helper";
import { chainMetaMap } from "@/data/chains.data";
import { useNFTMetadataMultichainCollectPage } from "@/hooks/query/api/use-nft-metadata-multichain-collect-page";

const NFTCard: React.FC<{ nft: NFTMetadataType }> = ({ nft }) => {
  const { data } = useTotalMintedNFT({
    address: nft.contract.address as HexAddress,
    chainId: nft.chainId as ChainSupported,
  });
  const network = chainMetaMap[nft.chainId as ChainSupported];

  return (
    <div className="gradient-border w-full relative border border-transparent shadow-lg rounded-md drop-shadow-sm">
      <div className="relative dark:bg-dark-100 light:bg-light-100 bg-background/90 flex flex-col justify-between p-4 rounded-md">
        <Link
          className="z-[2] block cursor-pointer"
          href={"/collect/nft/" + nft.contract.address + "_" + nft.chainId}
        >
          <div className="relative w-full min-h-[298px] aspect-square rounded-sm overflow-hidden">
            <Image
              fill
              alt={`${nft.name} NFT preview`}
              className="object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
              src={nft.image.cachedUrl || "/placeholder.jpg"}
            />
          </div>
        </Link>

        <div className="mt-6 h-full flex flex-col justify-between gap-4 z-[2]">
          <div className="mt-4 flex gap-2 items-center">
            <Avatar>
              <AvatarImage src={nft?.image.cachedUrl || "/placeholder.jpg"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span
              className="tracking-wide text-md w-[170px] cursor-default truncate font-bold"
              title={nft?.name}
            >
              {nft?.name}
            </span>
          </div>

          <div className="h-full flex flex-col gap-2 justify-between">
            <span className="text-sm font-extralight leading-tight">
              Minting Complete
            </span>
            <div className="flex flex-row items-center gap-2 text-sm">
              <span className="font-medium font-mono">
                {typeof data === "number" || typeof data === "string"
                  ? data
                  : 0}
              </span>
              <span>/</span>
              <Infinity />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Network:</span>
            <Link
              key={network.name}
              className="flex items-center gap-1"
              href={urlExplorer({
                chainId: nft.chainId as ChainSupported,
                address: nft.contract.address || "",
              })}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                alt={network.name}
                className="w-5 h-5"
                height={20}
                src={network.icon}
                width={20}
              />
              <span className="text-sm">{network.name}</span>
            </Link>
          </div>

          <Link
            className="w-full"
            href={"/collect/nft/" + nft.contract.address + "_" + nft.chainId}
            rel="noopener noreferrer"
          >
            <Button
              className="bg-blue-600 hover:bg-blue-700 w-full text-white"
              name="mint"
              type="button"
              variant={"default"}
            >
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const SecondaryComponent: React.FC = () => {
  const { data, isLoading } = useNFTMetadataMultichainCollectPage();

  return (
    <section
      className={`relative z-10 bg-background/70 min-h-screen text-white px-10`}
      id="Grid"
    >
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <Skeleton className="h-96 w-full" />
        </div>
      )}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-8 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.isArray(data) &&
          data.map((nft, idx) => <NFTCard key={idx} nft={nft} />)}
      </div>
    </section>
  );
};

export default SecondaryComponent;
