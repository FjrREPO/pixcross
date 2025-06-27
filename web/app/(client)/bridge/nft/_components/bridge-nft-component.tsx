"use client";

import React from "react";
import { useAccount } from "wagmi";
import { ArrowRightLeft, ChevronDown } from "lucide-react";
import Image from "next/image";

import WalletWrapper from "@/components/wallet/wallet-wrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { ChainData, chainData } from "@/data/chains.data";
import { NFTSelectionDialog } from "@/components/dialog/dialog-selection-nft";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { NFTSchemaType } from "@/types/api/nft.type";
import { cn } from "@/lib/utils";
import { useOwnerNFTByChain } from "@/hooks/query/api/use-owner-nft-by-chain";
import { useBridgeERC721 } from "@/hooks/mutation/contract/bridge/use-bridge-erc721";
import { useBridgeQuoteERC721 } from "@/hooks/query/contract/bridge/use-bridge-quote-erc721";
import DialogTransaction from "@/components/dialog/dialog-transaction";
import { MultiStepLoader } from "@/components/loader/multi-step-loader";

export default function BridgeNFTComponent() {
  const { address } = useAccount();
  const [showDialog, setShowDialog] = React.useState(false);
  const [fromChainId, setFromChainId] =
    React.useState<ChainSupported>(11155111);
  const [toChainId, setToChainId] = React.useState<ChainSupported>(84532);
  const [fromNetwork, setFromNetwork] = React.useState<ChainData>(chainData[0]);
  const [toNetwork, setToNetwork] = React.useState<ChainData>(chainData[1]);

  const { data: ownerNfts } = useOwnerNFTByChain({
    chainId: fromChainId,
  });

  const [selectedNFT, setSelectedNFT] = React.useState<
    NFTSchemaType | undefined
  >();

  const { data } = useBridgeQuoteERC721({
    tokenAddress: selectedNFT?.contract.address as HexAddress,
    chainId: fromChainId,
    destChainId: toChainId,
    enabled: true,
  });

  const { mutation, txHash, currentStepIndex, loadingStates } =
    useBridgeERC721();

  const handleBridge = () => {
    mutation.mutate(
      {
        chainId: fromChainId,
        destChainId: toChainId,
        quote: data,
        receiver: address as HexAddress,
        tokenAddress: selectedNFT?.contract.address as HexAddress,
        tokenId: Number(selectedNFT?.tokenId),
      },
      {
        onSuccess: () => {
          setShowDialog(true);
        },
      },
    );
  };

  const handleSwapNetworks = () => {
    const tempChainId = fromChainId;
    const tempNetwork = fromNetwork;

    setFromChainId(toChainId);
    setToChainId(tempChainId);
    setFromNetwork(toNetwork);
    setToNetwork(tempNetwork);
  };

  const handleNetworkSelect = (network: ChainData, type: "from" | "to") => {
    if (type === "from") {
      setFromNetwork(network);
      setFromChainId(network.chainId as ChainSupported);
    } else {
      setToNetwork(network);
      setToChainId(network.chainId as ChainSupported);
    }
  };

  return (
    <TooltipProvider>
      <WalletWrapper>
        <DialogTransaction
          chainId={fromChainId as ChainSupported}
          isOpen={showDialog}
          processName="Bridge"
          txHash={(txHash as HexAddress) || ""}
          onClose={() => setShowDialog(false)}
        />

        <MultiStepLoader
          loading={mutation.isPending}
          loadingStates={loadingStates}
          loop={false}
          value={currentStepIndex}
        />

        <div className="flex justify-center p-4 h-full pt-30">
          <Card className="w-full max-w-[652px] border-border shadow-lg">
            <CardContent className="p-6 md:p-8 space-y-5">
              <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
                <div className="w-full space-y-2">
                  <NetworkSelector
                    selectedNetwork={fromNetwork}
                    onSelect={(network) => handleNetworkSelect(network, "from")}
                  />
                </div>

                <div className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-8 w-8 p-0 rounded-full hover:bg-muted z-10"
                        size="sm"
                        variant="outline"
                        onClick={handleSwapNetworks}
                      >
                        <ArrowRightLeft className="h-4 w-4 -rotate-90 md:rotate-0" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Swap networks</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="w-full space-y-2">
                  <NetworkSelector
                    selectedNetwork={toNetwork}
                    onSelect={(network) => handleNetworkSelect(network, "to")}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Select NFT</h4>
                <NFTSelectionDialog
                  description="Choose an NFT to use as collateral or IP"
                  ownerNfts={ownerNfts}
                  selectedNFT={selectedNFT}
                  title="Select NFT for Supply"
                  onSelectNFT={setSelectedNFT}
                >
                  <button
                    className={cn(
                      "w-full p-4 rounded-lg border-2 border-dashed hover:border-primary/50 transition-colors",
                      selectedNFT
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25",
                    )}
                  >
                    {selectedNFT ? (
                      <div className="flex items-center gap-3">
                        <TokenImageCustom
                          address={selectedNFT.contract.address}
                          className="w-12 h-12 rounded-lg"
                        />
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {selectedNFT.contract.name}
                            </span>
                            <Image
                              alt={selectedNFT.contract.name}
                              className="w-4 h-4 rounded-full border border-white"
                              height={16}
                              src={fromNetwork.icon || "/placeholder.jpg"}
                              width={16}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {selectedNFT.contract.symbol} • #
                            {selectedNFT.tokenId}
                          </p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-4">
                        <span className="text-muted-foreground">
                          Select an NFT
                        </span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                </NFTSelectionDialog>
              </div>

              <Button
                className="w-full h-14 mt-8 font-mono uppercase tracking-wider text-base"
                disabled={selectedNFT === undefined}
                size="lg"
                onClick={handleBridge}
              >
                {selectedNFT === undefined
                  ? "Select NFT to Bridge"
                  : `Bridge ${selectedNFT.contract.symbol}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </WalletWrapper>
    </TooltipProvider>
  );
}

const NetworkSelector: React.FC<{
  selectedNetwork: ChainData;
  onSelect: (network: ChainData) => void;
}> = ({ selectedNetwork, onSelect }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        className="w-full justify-between h-16 px-4 bg-background hover:bg-muted/50 border-border"
        variant="outline"
      >
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full overflow-hidden">
            <Image
              alt={selectedNetwork.name}
              className="w-full h-full object-cover"
              height="24"
              src={selectedNetwork.icon}
              width="24"
              onError={(e) => {
                const target = e.target as HTMLImageElement;

                target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM2MzYzNzAiLz4KPHN2Zz4K";
              }}
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-mono font-medium uppercase tracking-wide text-sm">
              {selectedNetwork.name}
            </span>
            {/* <span className="text-xs text-muted-foreground">
              Chain ID: {selectedNetwork.chainId}
            </span> */}
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      {chainData.map((network) => (
        <DropdownMenuItem
          key={network.chainId}
          className="flex items-center gap-3 p-3"
          onClick={() => onSelect(network)}
        >
          <div className="h-6 w-6 rounded-full overflow-hidden">
            <Image
              alt={network.name}
              className="w-full h-full object-cover"
              height="24"
              src={network.icon}
              width="24"
              onError={(e) => {
                const target = e.target as HTMLImageElement;

                target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM2MzYzNzAiLz4KPHN2Zz4K";
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-medium uppercase tracking-wide text-sm">
              {network.name}
            </span>
            <span className="text-xs text-muted-foreground">
              Chain ID: {network.chainId}
            </span>
          </div>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
