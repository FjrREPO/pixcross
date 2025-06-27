"use client";

import React from "react";
import { useAccount } from "wagmi";
import {
  AlertCircle,
  ArrowUpDown,
  Clock,
  DollarSign,
  ArrowRight,
  Coins,
  Info,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

import { useBridgeERC20 } from "@/hooks/mutation/contract/bridge/use-bridge-erc20";
import { useBridgeQuoteERC20 } from "@/hooks/query/contract/bridge/use-bridge-quote-erc20";
import { PayFeesIn } from "@/types/contract/bridge.type";
import WalletWrapper from "@/components/wallet/wallet-wrapper";
import DialogTransaction from "@/components/dialog/dialog-transaction";
import { MultiStepLoader } from "@/components/loader/multi-step-loader";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChainData, chainData } from "@/data/chains.data";
import { CoinMarketCapType } from "@/types/api/cmc.type";
import { tokenMultichainData } from "@/data/token-multichain.data";
import { cn } from "@/lib/utils";
import { useBalanceUser } from "@/hooks/query/contract/erc20/use-balance-user";
import { formatCompactNumber } from "@/lib/helper/number";
import { normalize } from "@/lib/helper/bignumber";
import DialogSelectionBridge from "@/components/dialog/dialog-selection-bridge";

interface TokenNetworkOption {
  token: CoinMarketCapType;
  network: ChainData;
  chainId: ChainSupported;
  contractAddress: string;
}

export default function BridgeAssetsComponent() {
  const { address, isConnected } = useAccount();

  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  const [showFromSelector, setShowFromSelector] =
    React.useState<boolean>(false);
  const [showToSelector, setShowToSelector] = React.useState<boolean>(false);
  const [amount, setAmount] = React.useState<string>("");
  const [fromSelection, setFromSelection] =
    React.useState<TokenNetworkOption | null>(null);
  const [toSelection, setToSelection] =
    React.useState<TokenNetworkOption | null>(null);
  const [payFeesIn] = React.useState<PayFeesIn>(PayFeesIn.Native);
  const [isSwapping, setIsSwapping] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!fromSelection && !toSelection) {
      const allOptions = getAvailableTokenNetworkOptions();

      if (allOptions.length >= 2) {
        setFromSelection(allOptions[0]);
        setToSelection(allOptions[1]);
      }
    }
  }, [fromSelection, toSelection]);

  const getAvailableTokenNetworkOptions = (): TokenNetworkOption[] => {
    const options: TokenNetworkOption[] = [];

    tokenMultichainData.forEach((token) => {
      token.contract_address.forEach((contract) => {
        const network = chainData.find(
          (chain) => chain.chainId === contract.chainId,
        );

        if (network) {
          options.push({
            token,
            network,
            chainId: contract.chainId as ChainSupported,
            contractAddress: contract.contract_address,
          });
        }
      });
    });

    return options;
  };

  const getCompatibleDestinations = (
    selectedToken: CoinMarketCapType,
    excludeChainId?: ChainSupported,
  ): TokenNetworkOption[] => {
    const options: TokenNetworkOption[] = [];

    selectedToken.contract_address.forEach((contract) => {
      if (excludeChainId && contract.chainId === excludeChainId) return;

      const network = chainData.find(
        (chain) => chain.chainId === contract.chainId,
      );

      if (network) {
        options.push({
          token: selectedToken,
          network,
          chainId: contract.chainId as ChainSupported,
          contractAddress: contract.contract_address,
        });
      }
    });

    return options;
  };

  const { bNormalized: bnFrom, bLoading: isLoadingFromBalance } =
    useBalanceUser({
      chainId: fromSelection?.chainId as ChainSupported,
      token: fromSelection?.contractAddress as HexAddress,
    });

  const { bNormalized: bnTo, bLoading: isLoadingToBalance } = useBalanceUser({
    chainId: toSelection?.chainId as ChainSupported,
    token: toSelection?.contractAddress as HexAddress,
  });

  const {
    data: quoteData,
    isLoading: isLoadingQuote,
    error: quoteError,
  } = useBridgeQuoteERC20({
    amount: amount,
    chainId: fromSelection?.chainId as ChainSupported,
    destChainId: toSelection?.chainId as ChainSupported,
    tokenAddress: fromSelection?.contractAddress as HexAddress,
    decimals: 18,
    enabled: Boolean(
      amount &&
        parseFloat(amount) > 0 &&
        fromSelection &&
        toSelection &&
        parseFloat(bnFrom?.toString() || "0") >= parseFloat(amount) &&
        isConnected,
    ),
  });

  const { mutation, txHash, currentStepIndex, loadingStates } =
    useBridgeERC20();

  const handleBridge = () => {
    if (!isConnected || !fromSelection || !toSelection) return;

    mutation.mutate(
      {
        amount: amount,
        chainId: fromSelection.chainId,
        destChainId: toSelection.chainId,
        tokenAddress: fromSelection.contractAddress as HexAddress,
        quote: quoteData,
        payFeesIn: payFeesIn,
        decimals: 18,
        receiver: address as HexAddress,
      },
      {
        onSuccess: () => {
          setShowDialog(true);
        },
      },
    );
  };

  const handleSwapNetworks = () => {
    if (!fromSelection || !toSelection) return;

    setIsSwapping(true);
    setTimeout(() => {
      const tempSelection = fromSelection;

      setFromSelection(toSelection);
      setToSelection(tempSelection);
      setIsSwapping(false);
    }, 150);
  };

  const handleFromSelection = (option: TokenNetworkOption) => {
    setFromSelection(option);

    if (
      !toSelection ||
      toSelection.token.symbol !== option.token.symbol ||
      toSelection.chainId === option.chainId
    ) {
      const compatibleDestinations = getCompatibleDestinations(
        option.token,
        option.chainId,
      );

      if (compatibleDestinations.length > 0) {
        setToSelection(compatibleDestinations[0]);
      }
    }
  };

  const handleToSelection = (option: TokenNetworkOption) => {
    setToSelection(option);
  };

  const handleMaxAmount = () => {
    if (bnFrom) {
      setAmount(bnFrom.toString());
    }
  };

  const isInsufficientBalance =
    amount && bnFrom && parseFloat(amount) > parseFloat(bnFrom.toString());
  const isSameNetwork = fromSelection?.chainId === toSelection?.chainId;
  const isDifferentToken =
    fromSelection?.token.symbol !== toSelection?.token.symbol;
  const hasValidAmount =
    amount && parseFloat(amount) > 0 && parseFloat(amount) >= 10;
  const isFormValid =
    hasValidAmount &&
    !isInsufficientBalance &&
    !isSameNetwork &&
    !isDifferentToken &&
    fromSelection &&
    toSelection &&
    amount.length > 0 &&
    isConnected;

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (!hasValidAmount) return "Enter Amount";
    if (isInsufficientBalance) return "Insufficient Balance";
    if (isSameNetwork) return "Select Different Networks";
    if (isDifferentToken) return "Select Same Token";
    if (!fromSelection || !toSelection) return "Select Token & Network";
    if (isLoadingQuote) return "Getting Quote...";
    if (Number(amount) > Number(bnFrom?.toString()))
      return "Insufficient Amount";
    if (!quoteData) return "Get Quote Error";
    if (Number(amount) < 10) return "Minimum amount is 10";
    if (mutation.isPending) return "Bridging...";

    return "Bridge Assets";
  };

  const estimatedTime = "~25 minutes";

  const bridgeFee = quoteData?.totalFee
    ? normalize(quoteData.totalFee.toString(), 18)
    : "0.00";

  const getNativeTokenSymbol = (chainId: number) => {
    switch (chainId) {
      case 11155111:
      case 1:
        return "ETH";
      case 84532:
      case 8453:
        return "ETH";
      case 421614:
      case 42161:
        return "ETH";
      case 43113:
      case 43114:
        return "AVAX";
      default:
        return "ETH";
    }
  };

  const nativeTokenSymbol = fromSelection
    ? getNativeTokenSymbol(fromSelection.chainId)
    : "ETH";

  return (
    <TooltipProvider>
      <WalletWrapper>
        <DialogTransaction
          chainId={fromSelection?.chainId as ChainSupported}
          isOpen={showDialog}
          processName="Bridge"
          txHash={(txHash as HexAddress) || ""}
          onClose={() => setShowDialog(false)}
        />

        <DialogSelectionBridge
          availableOptions={getAvailableTokenNetworkOptions()}
          isOpen={showFromSelector}
          networks={chainData}
          selectedOption={fromSelection}
          title="Select Source Token"
          onClose={() => setShowFromSelector(false)}
          onSelect={handleFromSelection}
        />

        <DialogSelectionBridge
          availableOptions={
            fromSelection
              ? getCompatibleDestinations(
                  fromSelection.token,
                  fromSelection.chainId,
                )
              : []
          }
          isOpen={showToSelector}
          networks={chainData}
          selectedOption={toSelection}
          title="Select Destination Token"
          onClose={() => setShowToSelector(false)}
          onSelect={handleToSelection}
        />

        <MultiStepLoader
          loading={mutation.isPending}
          loadingStates={loadingStates}
          loop={false}
          value={currentStepIndex}
        />

        <div className="flex justify-center items-center h-full pt-30">
          <div className="w-full max-w-md space-y-4">
            <Card className="shadow-xl">
              <CardContent className="p-4 space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      From
                    </span>
                    {isLoadingFromBalance ? (
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Balance:
                        </span>
                        <button
                          className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                          onClick={handleMaxAmount}
                        >
                          {formatCompactNumber(bnFrom ?? 0)}{" "}
                          {fromSelection?.token.symbol || ""}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 hover:border-border transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TokenNetworkButton
                            label="Select token & network"
                            selectedOption={fromSelection}
                            onClick={() => setShowFromSelector(true)}
                          />
                        </div>
                        <div className="text-right">
                          <input
                            className={cn(
                              "bg-transparent text-right text-2xl font-semibold outline-none",
                              "placeholder:text-muted-foreground/50 w-full max-w-[120px]",
                              isInsufficientBalance && "text-destructive",
                            )}
                            placeholder="0.0"
                            type="number"
                            value={amount}
                            onChange={(e) => {
                              const value = e.target.value;

                              if (/^\d{0,7}(\.\d*)?$/.test(value)) {
                                setAmount(value);
                              }
                            }}
                            onFocus={(e) => e.target.select()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                  <Button
                    className={cn(
                      "h-10 w-10 rounded-xl bg-background border ring-0 shadow-lg",
                      "hover:shadow-xl transition-all duration-200",
                    )}
                    disabled={isSwapping || !fromSelection || !toSelection}
                    size="sm"
                    variant="outline"
                    onClick={handleSwapNetworks}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      To
                    </span>
                    {isLoadingToBalance ? (
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Balance:
                        </span>
                        <span className="text-xs font-medium">
                          {formatCompactNumber(bnTo ?? 0)}{" "}
                          {toSelection?.token.symbol || ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 hover:border-border transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TokenNetworkButton
                          disabled={!fromSelection}
                          label="Select destination"
                          selectedOption={toSelection}
                          onClick={() => setShowToSelector(true)}
                        />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-semibold text-muted-foreground/60">
                          {amount && !isNaN(parseFloat(amount))
                            ? amount
                            : "0.0"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isSameNetwork && (
                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                      Please select different source and destination networks.
                    </AlertDescription>
                  </Alert>
                )}

                {isDifferentToken && (
                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                      You can only bridge the same token between networks.
                    </AlertDescription>
                  </Alert>
                )}

                {quoteError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to get bridge quote. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-muted/20 rounded-xl p-4 space-y-3 border border-border/30">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Estimated Time
                      </span>
                    </div>
                    <span className="font-medium">{estimatedTime}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Bridge Fee</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Network fees for processing your bridge transaction
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    {quoteData &&
                    hasValidAmount &&
                    !isSameNetwork &&
                    !isDifferentToken ? (
                      <span className="font-medium">
                        {formatCompactNumber(bridgeFee?.toString(), 4)}{" "}
                        {nativeTokenSymbol}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {isLoadingQuote ? "Calculating..." : "N/A"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        You will receive
                      </span>
                    </div>
                    {quoteData &&
                    hasValidAmount &&
                    !isSameNetwork &&
                    !isDifferentToken ? (
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCompactNumber(Number(amount || 0))}{" "}
                        {toSelection?.token.symbol || ""}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {isLoadingQuote ? "Calculating..." : "N/A"}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  className={cn(
                    "w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:from-muted disabled:to-muted",
                    "shadow-lg hover:shadow-xl disabled:shadow-none",
                  )}
                  disabled={
                    !isFormValid ||
                    mutation.isPending ||
                    isLoadingQuote ||
                    isSameNetwork ||
                    isDifferentToken ||
                    Number(amount) > Number(bnFrom?.toString()) ||
                    !quoteData
                  }
                  onClick={handleBridge}
                >
                  {mutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      {getButtonText()}
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </WalletWrapper>
    </TooltipProvider>
  );
}

interface TokenNetworkButtonProps {
  selectedOption: TokenNetworkOption | null;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function TokenNetworkButton({
  selectedOption,
  label,
  onClick,
  disabled = false,
}: TokenNetworkButtonProps) {
  return (
    <button
      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      disabled={disabled}
      onClick={onClick}
    >
      {selectedOption ? (
        <div className="flex items-center gap-5">
          <div className="relative w-6 h-6">
            <Image
              alt={selectedOption.network.icon}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full z-0 w-6 h-6 max-w-6 max-h-6"
              height={24}
              src={selectedOption.network.icon}
              width={24}
            />

            <Image
              alt={selectedOption.token.symbol}
              className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full z-10 w-6 h-6 max-w-6 max-h-6"
              height={24}
              src={selectedOption.token.logo}
              width={24}
            />
          </div>
          <div className="flex items-center gap-1">
            <span>{selectedOption.token.symbol}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground">{label}</span>
      )}
    </button>
  );
}
