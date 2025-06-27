"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Search, ChevronDown, Coins, Wallet, Check } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { TokenSymbol } from "@/components/token/token-symbol";
import { CreatePoolType } from "@/types/form/create-pool.type";
import { CoinMarketCapType } from "@/types/api/cmc.type";
import { NFTMetadataType } from "@/types/api/nft-metadata.type";

interface Step1TokenSelectionProps {
  form: UseFormReturn<CreatePoolType>;
  chainId: ChainSupported;
  loanTokens: CoinMarketCapType[];
  collateralTokens: NFTMetadataType[];
  isLoadingLoanTokens: boolean;
  isLoadingCollateralTokens: boolean;
}

export default function Step1TokenSelection({
  form,
  chainId,
  loanTokens,
  collateralTokens,
  isLoadingLoanTokens,
  isLoadingCollateralTokens,
}: Step1TokenSelectionProps) {
  const [collateralDialogOpen, setCollateralDialogOpen] = useState(false);
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  const [collateralSearch, setCollateralSearch] = useState("");
  const [loanSearch, setLoanSearch] = useState("");

  const selectedCollateral = form.watch("collateralToken");
  const selectedLoan = form.watch("loanToken");

  const filteredCollateralTokens = collateralTokens.filter(
    (token) =>
      token.contract.symbol
        .toLowerCase()
        .includes(collateralSearch.toLowerCase()) ||
      token.contract.name
        .toLowerCase()
        .includes(collateralSearch.toLowerCase()),
  );

  const filteredLoanTokens = loanTokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(loanSearch.toLowerCase()) ||
      token.name.toLowerCase().includes(loanSearch.toLowerCase()),
  );

  const handleCollateralSelect = (token: HexAddress) => {
    form.setValue("collateralToken", token);
    setCollateralDialogOpen(false);
    setCollateralSearch("");
  };

  const handleLoanSelect = (token: HexAddress) => {
    form.setValue("loanToken", token);
    setLoanDialogOpen(false);
    setLoanSearch("");
  };

  const selectedCollateralToken = collateralTokens.find(
    (token) =>
      (token.contract_address?.find((addr) => addr.chainId === chainId)
        ?.contract_address as HexAddress) === selectedCollateral,
  );

  const selectedLoanToken = loanTokens.find((token) =>
    token.contract_address.find(
      (addr) =>
        addr.chainId === chainId && addr.contract_address === selectedLoan,
    ),
  );

  const TokenLoadingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const EmptyState = ({ type }: { type: "collateral" | "loan" }) => (
    <div className="text-center py-8">
      <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
        {type === "collateral" ? (
          <Coins className="w-6 h-6 text-muted-foreground" />
        ) : (
          <Wallet className="w-6 h-6 text-muted-foreground" />
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        No {type} tokens found matching your search
      </p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Select Tokens for Your Pool</h3>
        <p className="text-sm text-muted-foreground">
          Choose the collateral token (NFT collection) and loan token (ERC-20)
          for your pool. These tokens will be used for borrowing and lending
          within the pool.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Collateral Token</Label>
            <Badge className="text-xs" variant="secondary">
              NFT Collection
            </Badge>
          </div>

          <Dialog
            open={collateralDialogOpen}
            onOpenChange={setCollateralDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                className="w-full h-auto p-4 justify-between hover:shadow-md transition-all duration-200"
                type="button"
                variant="outline"
              >
                {selectedCollateralToken ? (
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        alt={selectedCollateralToken.name}
                        className="w-10 h-10 rounded-full border-2 border-background shadow-sm"
                        height={40}
                        src={selectedCollateralToken.image.cachedUrl}
                        width={40}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;

                          target.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">
                        {selectedCollateralToken.contract.symbol}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedCollateralToken.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Select Collateral</p>
                      <p className="text-xs text-muted-foreground">
                        Choose NFT collection
                      </p>
                    </div>
                  </div>
                )}
                <ChevronDown className="h-4 w-4 shrink-0" />
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Select Collateral Token
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10 h-10"
                    placeholder="Search collections..."
                    value={collateralSearch}
                    onChange={(e) => setCollateralSearch(e.target.value)}
                  />
                </div>

                <Separator />

                <ScrollArea className="h-[300px]">
                  <div className="space-y-2 pr-4">
                    {isLoadingCollateralTokens ? (
                      <TokenLoadingSkeleton />
                    ) : filteredCollateralTokens.length === 0 ? (
                      <EmptyState type="collateral" />
                    ) : (
                      filteredCollateralTokens.map((token, idx) => (
                        <Card
                          key={idx}
                          className={`cursor-pointer hover:shadow-md transition-all duration-200 border ${
                            selectedCollateral ===
                            (token.contract_address?.find(
                              (addr) => addr.chainId === chainId,
                            )?.contract_address as HexAddress)
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() =>
                            handleCollateralSelect(
                              token.contract_address?.find(
                                (addr) => addr.chainId === chainId,
                              )?.contract_address as HexAddress,
                            )
                          }
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Image
                                  alt={token.name}
                                  className="w-10 h-10 rounded-full border"
                                  height={40}
                                  src={token.image.cachedUrl}
                                  width={40}
                                />
                                <div>
                                  <p className="font-semibold text-sm">
                                    {token.contract.symbol}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {token.name}
                                  </p>
                                </div>
                              </div>
                              {selectedCollateral ===
                                (token.contract_address?.find(
                                  (addr) => addr.chainId === chainId,
                                )?.contract_address as HexAddress) && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Loan Token</Label>
            <Badge className="text-xs" variant="secondary">
              ERC-20
            </Badge>
          </div>

          <Dialog open={loanDialogOpen} onOpenChange={setLoanDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full h-auto p-4 justify-between hover:shadow-md transition-all duration-200"
                type="button"
                variant="outline"
              >
                {selectedLoanToken ? (
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <TokenImageCustom
                        address={selectedLoan}
                        className="w-10 h-10 border-2 border-background shadow-sm"
                      />
                    </div>
                    <div className="text-left">
                      <TokenSymbol
                        address={selectedLoan}
                        className="font-semibold text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        {selectedLoanToken.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Select Loan Token</p>
                      <p className="text-xs text-muted-foreground">
                        Choose loan asset
                      </p>
                    </div>
                  </div>
                )}
                <ChevronDown className="h-4 w-4 shrink-0" />
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Select Loan Token
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10 h-10"
                    placeholder="Search tokens..."
                    value={loanSearch}
                    onChange={(e) => setLoanSearch(e.target.value)}
                  />
                </div>

                <Separator />

                <ScrollArea className="h-[300px]">
                  <div className="space-y-2 pr-4">
                    {isLoadingLoanTokens ? (
                      <TokenLoadingSkeleton />
                    ) : filteredLoanTokens.length === 0 ? (
                      <EmptyState type="loan" />
                    ) : (
                      filteredLoanTokens.map((token, idx) => {
                        const contractAddress = token.contract_address.find(
                          (addr) => addr.chainId === chainId,
                        )?.contract_address as HexAddress;

                        const isSelected = selectedLoan === contractAddress;

                        return (
                          <Card
                            key={idx}
                            className={`cursor-pointer hover:shadow-md transition-all duration-200 border ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() => handleLoanSelect(contractAddress)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <TokenImageCustom
                                    address={contractAddress || ""}
                                    className="w-10 h-10 border"
                                  />
                                  <div>
                                    <p className="font-semibold text-sm">
                                      {token.symbol}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                      {token.name}
                                    </p>
                                  </div>
                                </div>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-primary" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
