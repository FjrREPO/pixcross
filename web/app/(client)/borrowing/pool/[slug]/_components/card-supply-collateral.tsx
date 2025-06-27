import React, { useState } from "react";
import { Info, ChevronDown, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { PoolType } from "@/types/graphql/pool.type";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { TokenSymbol } from "@/components/token/token-symbol";
import { NFTSelectionDialog } from "@/components/dialog/dialog-selection-nft";
import { useSupplyCollateral } from "@/hooks/mutation/contract/pool/use-supply-collateral";
import DialogTransaction from "@/components/dialog/dialog-transaction";
import { MultiStepLoader } from "@/components/loader/multi-step-loader";
import { NFTSchemaType } from "@/types/api/nft.type";

interface CardSupplyProps {
  data: PoolType | undefined;
  rPositions: any;
  ownerNfts?: NFTSchemaType[];
  poolId?: string;
  chainId: ChainSupported;
  className?: string;
}

export default function CardSupplyCollateral({
  data,
  rPositions,
  ownerNfts,
  poolId,
  chainId,
  className,
}: CardSupplyProps) {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTSchemaType | undefined>();

  const filteredNfts = ownerNfts?.filter((nft) => nft.chainId === chainId);

  const { mutation, txHash, loadingStates, currentStepIndex } =
    useSupplyCollateral();

  const handleSupply = () => {
    mutation.mutate(
      {
        id: poolId ?? "",
        tokenId: selectedNFT?.tokenId ?? "",
        collateralAddress: data?.collateralAddress as HexAddress,
        chainId: data?.chainId as ChainSupported,
      },
      {
        onSuccess: () => {
          setShowSuccessDialog(true);
          rPositions();
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        },
      },
    );
  };

  const isLoading = mutation.isPending;
  const isAddressMismatch =
    selectedNFT &&
    data?.collateralAddress &&
    data.collateralAddress.toLowerCase() !==
      selectedNFT.contract.address.toLowerCase();

  return (
    <React.Fragment>
      <DialogTransaction
        chainId={data?.chainId as ChainSupported}
        isOpen={showSuccessDialog}
        processName="Supply Collateral"
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

      <TooltipProvider>
        <Card
          className={cn(
            "transition-all duration-200 hover:shadow-lg",
            className,
          )}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold">
                    Supply Collateral
                  </CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Supply an IP NFT as collateral to this pool. Ensure the NFT is
                  compatible with the pool&apos;s collateral token.
                </CardDescription>
              </div>
              {data?.loanAddress && (
                <Badge className="text-sm" variant="outline">
                  Active
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Select NFT</h4>
              <NFTSelectionDialog
                description="Choose an NFT to use as collateral or IP"
                ownerNfts={filteredNfts}
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
                          <Badge className="text-xs" variant={"default"}>
                            IP
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedNFT.contract.symbol} • #{selectedNFT.tokenId}
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

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Pool Collateral</h4>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <TokenImageCustom
                  address={data?.collateralAddress}
                  className="w-6 h-6 ring-2 ring-background shadow-sm"
                />
                <TokenSymbol
                  address={data?.collateralAddress}
                  className="text-lg font-semibold"
                />
              </div>
            </div>

            {isAddressMismatch && (
              <Alert
                className="border-orange-200 bg-orange-50 dark:bg-orange-950/20"
                variant="destructive"
              >
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>Token Mismatch:</strong> The selected NFT contract (
                  {selectedNFT?.contract.symbol}) doesn&apos;t match the
                  pool&apos;s collateral token. Please select an NFT from the
                  correct collection or choose a different pool.
                </AlertDescription>
              </Alert>
            )}

            <Button
              className={cn(
                "w-full h-12 text-base font-medium transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
                "bg-primary hover:bg-primary/90",
              )}
              disabled={Boolean(isLoading || !selectedNFT || isAddressMismatch)}
              onClick={handleSupply}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  Supply{" "}
                  {selectedNFT ? `with ${selectedNFT.contract.symbol}` : ""}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <Info className="w-3 h-3 mr-1" />
              <span>Transaction fees may apply</span>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    </React.Fragment>
  );
}
