import React, { useCallback, useMemo, useState } from "react";
import { Info, TrendingUp, TrendingDown, Wallet } from "lucide-react";

import { TokenSymbol } from "../token/token-symbol";
import { MultiStepLoader } from "../loader/multi-step-loader";

import DialogTransaction from "./dialog-transaction";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { PoolType } from "@/types/graphql/pool.type";
import { PositionType } from "@/types/graphql/position.type";
import { useOraclePrice } from "@/hooks/query/contract/oracle/use-oracle-price";
import { formatAmountInput, formatCompactNumber } from "@/lib/helper/number";
import { normalize } from "@/lib/helper/bignumber";
import { NFTSchemaType } from "@/types/api/nft.type";
import { useBorrowPool } from "@/hooks/mutation/contract/pool/use-borrow-pool";
import { useRepayPool } from "@/hooks/mutation/contract/pool/use-repay-pool";
import { useBalanceUser } from "@/hooks/query/contract/erc20/use-balance-user";
import { useWithdrawCollateral } from "@/hooks/mutation/contract/pool/use-withdraw-collateral";

interface PositionDialogProps {
  open: boolean;
  onClose: () => void;
  data: PoolType | undefined;
  nftMetadata: NFTSchemaType | null;
  position: PositionType | null;
}

export default function PositionDialog({
  open,
  onClose,
  data,
  nftMetadata,
  position,
}: PositionDialogProps) {
  const [activeDialog, setActiveDialog] = useState<
    "borrow" | "repay" | "withdraw" | null
  >(null);
  const [activeTab, setActiveTab] = useState("details");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");

  const { bNormalized } = useBalanceUser({
    token: data?.loanAddress as HexAddress,
    chainId: data?.chainId as ChainSupported,
  });

  const { data: rawPrice } = useOraclePrice({
    addressOracle: data?.oracle as HexAddress,
    tokenId: nftMetadata?.tokenId || "0",
  });

  const priceNFT = normalize(Number(rawPrice ?? 0), 18);

  const tabs = [
    { id: "details", label: "Details", icon: Info },
    { id: "borrow", label: "Borrow", icon: TrendingUp },
    { id: "repay", label: "Repay", icon: TrendingDown },
    { id: "withdraw", label: "Withdraw", icon: Wallet },
  ];

  const maxBorrow = useMemo(
    () => Number(priceNFT) * (Number(data?.ltv) / 100),
    [data, priceNFT],
  );

  const totalBorrowed = normalize(position?.borrowShares ?? 0, 18);

  const availableToBorrow = useMemo(() => {
    if (!data || !position) return 0;
    const available = Number(maxBorrow) - Number(totalBorrowed);

    return Math.max(0, available);
  }, [data, position, maxBorrow, totalBorrowed]);

  const handleInputBorrowChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const formatted = formatAmountInput(input, 18);

      if (Number(formatted) > availableToBorrow) {
        setBorrowAmount(availableToBorrow.toString());
      } else {
        setBorrowAmount(formatted);
      }
    },
    [availableToBorrow],
  );

  const handleInputRepayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const formatted = formatAmountInput(input, 18);

      if (Number(formatted) > Number(totalBorrowed)) {
        setRepayAmount(totalBorrowed.toString());
      } else {
        setRepayAmount(formatted);
      }
    },
    [totalBorrowed],
  );

  const {
    mutation: mutationBorrow,
    txHash: txBorrow,
    loadingStates: loadingStatesBorrow,
    currentStepIndex: currentStepIndexBorrow,
  } = useBorrowPool();
  const {
    mutation: mutationRepay,
    txHash: txRepay,
    loadingStates: loadingStatesRepay,
    currentStepIndex: currentStepIndexRepay,
  } = useRepayPool();
  const {
    mutation: mutationWithdraw,
    txHash: txWithdraw,
    loadingStates: loadingStatesWithdraw,
    currentStepIndex: currentStepIndexWithdraw,
  } = useWithdrawCollateral();

  const handleBorrow = async () => {
    if (!data || !nftMetadata) return;

    mutationBorrow.mutate(
      {
        id: data?.id || "",
        amount: Number(borrowAmount),
        tokenId: nftMetadata?.tokenId || "",
        decimals: 18,
        chainId: data?.chainId as ChainSupported,
      },
      {
        onSuccess: () => {
          setBorrowAmount("");
          setActiveDialog("borrow");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
      },
    );
  };

  const handleRepay = async () => {
    if (!data || !nftMetadata?.tokenId) return;

    mutationRepay.mutate(
      {
        loanAddress: data?.loanAddress as HexAddress,
        id: data?.id || "",
        amount: Number(repayAmount),
        tokenId: nftMetadata?.tokenId || "0",
        decimals: 18,
        chainId: data?.chainId as ChainSupported,
      },
      {
        onSuccess: () => {
          setRepayAmount("");
          setActiveDialog("repay");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
      },
    );
  };

  const handleWithdraw = async () => {
    if (!data || !nftMetadata) return;

    mutationWithdraw.mutate(
      {
        id: data?.id || "",
        tokenId: nftMetadata?.tokenId || "0",
        collateralAddress: data?.collateralAddress as HexAddress,
        chainId: data?.chainId as ChainSupported,
      },
      {
        onSuccess: () => {
          setActiveDialog("withdraw");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
      },
    );
  };

  const isLoading =
    mutationBorrow.isPending ||
    mutationRepay.isPending ||
    mutationWithdraw.isPending;

  const isCollateralSafe = useMemo(() => {
    if (!data || !priceNFT || !totalBorrowed) return true;

    const lthPercentage = Number(data.lth || "0") / 100;
    const liquidationThreshold = Number(priceNFT) * lthPercentage;

    return Number(totalBorrowed) <= liquidationThreshold;
  }, [data, priceNFT, totalBorrowed]);

  const renderTabContent = () => {
    if (!nftMetadata || !position) return null;

    switch (activeTab) {
      case "details":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Collateral</p>
                <div className="flex items-center gap-2">
                  <TokenImageCustom
                    address={nftMetadata.contract.address}
                    className="w-6 h-6"
                  />
                  <span className="font-medium">
                    {nftMetadata.contract.symbol} #{nftMetadata.tokenId}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Collateral Value
                </p>
                <div className="flex items-center gap-2">
                  <TokenImageCustom
                    address={data?.loanAddress}
                    className="w-6 h-6"
                  />
                  <p className="text-md font-semibold">
                    {formatCompactNumber(
                      typeof priceNFT === "number" ||
                        typeof priceNFT === "string"
                        ? priceNFT
                        : 0,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Borrowed</p>
                <div className="flex items-center gap-2">
                  <TokenImageCustom
                    address={data?.loanAddress}
                    className="w-6 h-6"
                  />
                  <p className="text-md font-semibold">
                    {formatCompactNumber(totalBorrowed || "0")}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Max Borrow Limit
                </p>
                <div className="flex items-center gap-2">
                  <TokenImageCustom
                    address={data?.loanAddress}
                    className="w-6 h-6"
                  />
                  <p className="text-sm font-semibold">
                    {formatCompactNumber(maxBorrow || "0")}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Loan To Value (LTV)
                </p>
                <p className="font-medium text-md">
                  {position.pool.ltv || "0"}%
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Liquidation Threshold (LTH)
                </p>
                <p className="font-medium text-md">
                  {position.pool.lth || "0"}%
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={!isCollateralSafe ? "destructive" : "default"}>
                  {!isCollateralSafe ? "At Risk" : "Safe"}
                </Badge>
              </div>
            </div>
          </div>
        );

      case "borrow":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Borrow Amount</p>
              <div className="relative">
                <input
                  className="w-full p-3 pr-16 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.0"
                  type="number"
                  value={borrowAmount}
                  onChange={handleInputBorrowChange}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <TokenImageCustom
                    address={data?.loanAddress}
                    className="w-4 h-4"
                  />
                  <TokenSymbol
                    address={data?.loanAddress}
                    className="font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setBorrowAmount((availableToBorrow * 0.25).toString())
                }
              >
                25%
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setBorrowAmount((availableToBorrow * 0.5).toString())
                }
              >
                50%
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBorrowAmount(availableToBorrow.toString())}
              >
                100%
              </Button>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Available to borrow
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {formatCompactNumber(availableToBorrow)}
                  </span>
                  <TokenImageCustom
                    address={data?.loanAddress}
                    className="w-6 h-6"
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Borrowed</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {formatCompactNumber(totalBorrowed || "0")}
                  </span>
                  <TokenImageCustom
                    address={data?.loanAddress}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12"
              disabled={
                isLoading ||
                !borrowAmount ||
                Number(borrowAmount) <= 0 ||
                Number(borrowAmount) > availableToBorrow
              }
              onClick={handleBorrow}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span>Borrow {borrowAmount || "0"}</span>
                  <TokenSymbol
                    address={data?.loanAddress}
                    className="font-medium"
                  />
                </div>
              )}
            </Button>
          </div>
        );

      case "repay":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Repay Amount</p>
              <div className="relative">
                <input
                  className="w-full p-3 pr-16 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.0"
                  type="number"
                  value={repayAmount}
                  onChange={handleInputRepayChange}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <TokenImageCustom
                    address={data?.loanAddress}
                    className="w-4 h-4"
                  />
                  <TokenSymbol
                    address={data?.loanAddress}
                    className="font-medium"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Your current balance: {formatCompactNumber(bNormalized || "0")}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setRepayAmount((Number(totalBorrowed) * 0.25).toString())
                }
              >
                25%
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setRepayAmount((Number(totalBorrowed) * 0.5).toString())
                }
              >
                50%
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRepayAmount(totalBorrowed.toString())}
              >
                100%
              </Button>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Outstanding debt</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {formatCompactNumber(totalBorrowed)}
                  </span>
                  <TokenImageCustom
                    address={data?.loanAddress}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12"
              disabled={
                isLoading ||
                !repayAmount ||
                Number(repayAmount) <= 0 ||
                Number(repayAmount) > Number(totalBorrowed) ||
                Number(repayAmount) > Number(bNormalized || "0")
              }
              onClick={handleRepay}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span>Repay {repayAmount || "0"}</span>
                  <TokenSymbol
                    address={data?.loanAddress}
                    className="font-medium"
                  />
                </div>
              )}
            </Button>
          </div>
        );

      case "withdraw":
        const hasOutstandingDebt = Number(totalBorrowed) > 0;

        return (
          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                You can only withdraw collateral after fully repaying your debt.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Collateral NFT</h4>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <TokenImageCustom
                  address={nftMetadata.contract.address}
                  className="w-12 h-12 rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {nftMetadata.contract.name}
                    </span>
                    <Badge className="text-xs" variant="default">
                      NFT
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {nftMetadata.contract.symbol} • #{nftMetadata.tokenId}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Outstanding debt</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">
                    {formatCompactNumber(totalBorrowed)}
                  </span>
                  <TokenSymbol
                    address={data?.loanAddress}
                    className="font-medium"
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  className="text-xs"
                  variant={hasOutstandingDebt ? "destructive" : "default"}
                >
                  {hasOutstandingDebt ? "Debt Outstanding" : "No Debt"}
                </Badge>
              </div>
            </div>

            <Button
              className="w-full h-12"
              disabled={isLoading || hasOutstandingDebt}
              onClick={handleWithdraw}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                "Withdraw Collateral"
              )}
            </Button>

            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <Info className="w-3 h-3 mr-1" />
              <span>Repay all debt to enable withdrawal</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!nftMetadata || !position) return null;

  return (
    <React.Fragment>
      <DialogTransaction
        chainId={data?.chainId as ChainSupported}
        isOpen={activeDialog != null}
        processName={
          txBorrow
            ? "Borrowing"
            : txRepay
              ? "Repaying"
              : txWithdraw
                ? "Withdrawing"
                : ""
        }
        txHash={((txBorrow || txRepay || txWithdraw) as HexAddress) || ""}
        onClose={() => {
          setActiveDialog(null);
        }}
      />
      <MultiStepLoader
        loading={
          mutationBorrow.isPending ||
          mutationRepay.isPending ||
          mutationWithdraw.isPending
        }
        loadingStates={
          mutationBorrow.isPending
            ? loadingStatesBorrow
            : mutationRepay.isPending
              ? loadingStatesRepay
              : mutationWithdraw.isPending
                ? loadingStatesWithdraw
                : []
        }
        loop={false}
        value={
          mutationBorrow.isPending
            ? currentStepIndexBorrow
            : mutationRepay.isPending
              ? currentStepIndexRepay
              : mutationWithdraw.isPending
                ? currentStepIndexWithdraw
                : 0
        }
      />

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center gap-2 w-full">
                <DialogTitle className="text-lg font-semibold">
                  Position {nftMetadata.contract.name} #
                  {nftMetadata.tokenId || "N/A"}
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm text-muted-foreground">
                Manage your collateral position and borrowing activities.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <Separator />

            <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all cursor-pointer",
                      activeTab === tab.id
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="min-h-[200px]">{renderTabContent()}</div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
