"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { urlExplorer } from "@/lib/helper/helper";
import { useNFTMintStatus } from "@/hooks/query/contract/erc721/use-nft-mint-status";
import { Button } from "@/components/ui/button";
import DialogTransaction from "@/components/dialog/dialog-transaction";
import { MultiStepLoader } from "@/components/loader/multi-step-loader";
import { useNFTMetadataByAddress } from "@/hooks/query/api/use-nft-metadata-by-address";
import Loading from "@/components/loader/loading";
import { chainMetaMap } from "@/data/chains.data";
import ButtonConnectWrapper from "@/components/wallet/button-connect-wrapper";
import { useNFTMetadataMultichainCollectPage } from "@/hooks/query/api/use-nft-metadata-multichain-collect-page";
import { useMintNFT } from "@/hooks/mutation/contract/erc721/use-mint-nft";

const MainComponent = ({
  contractAddress,
  chainId,
}: {
  contractAddress: string;
  chainId: ChainSupported;
}) => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const {
    data: datas,
    isLoading,
    refetch,
  } = useNFTMetadataByAddress({
    contractAddress,
    chainId,
  });
  const data = datas as typeof datas | undefined;

  const { data: isMinted, refetch: rIsMinted } = useNFTMintStatus({
    address: (data?.contract.address as HexAddress) || "",
    chainId: data?.chainId as ChainSupported,
  });

  const network = chainMetaMap[data?.chainId as ChainSupported];

  const { mutation, txHash, loadingStates, currentStepIndex } = useMintNFT();

  const { refetch: rMultichain } = useNFTMetadataMultichainCollectPage();

  const handleMint = () => {
    mutation.mutate(
      {
        nftAddress: data?.contract.address as HexAddress,
        chainId: data?.chainId as ChainSupported,
      },
      {
        onSuccess: () => {
          rIsMinted();
          setShowSuccessDialog(true);
          refetch();
          rMultichain();
        },
      },
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <DialogTransaction
        chainId={data?.chainId as ChainSupported}
        isOpen={showSuccessDialog}
        processName="Mint"
        txHash={(txHash as HexAddress) || ""}
        onClose={() => {
          setShowSuccessDialog(false);
        }}
      />
      <MultiStepLoader
        loading={mutation.isPending}
        loadingStates={loadingStates}
        loop={false}
        value={currentStepIndex}
      />

      <section className="sticky top-0 h-screen z-0" id="Featured">
        <main id="DropMintTemplate">
          <div className="-mx-[1px] -mt-[1px] flex flex-col justify-between lg:mx-0 lg:-ml-[1px] lg:flex-row h-[100dvh]">
            <div className="relative flex h-[calc(100%-400px)] flex-1 flex-col items-center justify-center gap-7 lg:h-[calc(100%-var(--banner-height))] lg:pt-[calc(72px+var(--banner-height))] 2xl:gap-12 pt-28 md:pt-0">
              <div
                className="absolute inset-0 lg:right-[calc(472px)] lg:m-auto lg:h-full lg:w-full"
                id="preview-background"
                style={{
                  background: `url("${data?.image.cachedUrl}") center center / cover no-repeat`,
                }}
              >
                <div className="absolute inset-0 bg-black/30" />
                <div
                  className="h-full w-full bg-gradient-to-b backdrop-blur-[60px] from-black/90 to-black/15 dark:from-white/20 dark:to-white/10"
                  id="preview-backdrop"
                />
              </div>

              <div className="max-h-[90%] w-[87%] max-w-[472px] md:w-[80%] lg:max-w-[1320px] max-md:pt-[var(--nav-height)] md:pt-25">
                <div
                  className="h-full max-h-full w-full max-w-full"
                  style={{
                    willChange: "transform",
                    transition: "400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)",
                    transform:
                      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
                  }}
                >
                  <Image
                    priority
                    alt="NFT preview"
                    className="h-full w-full object-contain max-h-[70dvh] rounded-2xl"
                    height={1320}
                    src={data?.image.cachedUrl || "/placeholder.jpg"}
                    width={1320}
                  />
                </div>
              </div>
            </div>

            <aside
              className="md:mx-auto md:min-w-[472px] lg:mt-[calc(var(--nav-height)-16px)] min-h-[368px] lg:min-h-[368px]"
              id="sidebar"
            >
              <div className="mx-auto h-full max-w-[100vw] p-4 md:max-w-[472px] lg:p-8">
                <div className="flex h-full flex-col pt-5 lg:pt-25">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-normal uppercase tracking-wider text-sm mb-4 hidden text-gray-400 lg:block">
                        IP NFT
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium tracking-tight text-xl block lg:text-2xl lg:break-words max-md:truncate">
                        {data?.contract.name}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2 items-center">
                      <Avatar>
                        <AvatarImage
                          src={data?.image.cachedUrl || "/placeholder.jpg"}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span
                        className="tracking-wide text-md w-[170px] cursor-default truncate font-bold"
                        title={data?.contract.symbol || "No Symbol"}
                      >
                        {data?.contract.symbol || "No Symbol"}
                      </span>
                    </div>
                  </div>

                  <span className="font-light tracking-wide text-sm mt-2 hidden whitespace-pre-wrap text-gray-400 lg:block lg:max-h-[100px] lg:overflow-y-auto">
                    {data?.raw.metadata.description}
                  </span>

                  <div className="flex flex-1 flex-col">
                    <div className="my-4 flex gap-6 lg:my-10">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium tracking-tight text-lg text-gray-500">
                          <span className="text-white font-bold">
                            {isMinted ? "Already Minted" : "Not Minted Yet"}
                          </span>
                        </span>
                        <span className="font-light tracking-wide text-sm text-gray-400">
                          Status
                        </span>
                      </div>
                    </div>

                    <ButtonConnectWrapper>
                      <Button
                        disabled={!!isMinted}
                        name="mint"
                        type="button"
                        variant={isMinted ? "secondary" : "default"}
                        onClick={handleMint}
                      >
                        Mint
                      </Button>
                    </ButtonConnectWrapper>

                    <div className="mt-4 flex flex-wrap gap-6 lg:mt-10">
                      <div className="flex gap-2 justify-center bg-primary/10 border border-neutral-400 rounded-sm p-4 cursor-default flex-row items-center">
                        <div className="flex items-center min-w-[unset]">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center gap-3">
                              <Link
                                key={network.name}
                                className="flex items-center"
                                href={urlExplorer({
                                  chainId: data?.chainId as ChainSupported,
                                  address: data?.contract.address,
                                })}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <div>
                                  <Image
                                    alt={network.name}
                                    className="w-6 h-6"
                                    height={24}
                                    src={network.icon}
                                    width={24}
                                  />
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </section>
    </React.Fragment>
  );
};

export default MainComponent;
