import { Info, Wallet } from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { CuratorType } from "@/types/graphql/curator.type";
import { useBalanceUser } from "@/hooks/query/contract/erc20/use-balance-user";
import {
  cleanNumberInput,
  formatAmountInput,
  formatCompactNumber,
} from "@/lib/helper/number";
import { cn } from "@/lib/utils";
import { useSupplyCurator } from "@/hooks/mutation/contract/curator/use-supply-curator";
import DialogTransaction from "@/components/dialog/dialog-transaction";
import { MultiStepLoader } from "@/components/loader/multi-step-loader";
import { TokenSymbol } from "@/components/token/token-symbol";

const AMOUNT_PRESETS = [
  {
    label: "25%",
    value: 0.25,
    color: "bg-blue-100 hover:bg-blue-200 text-white",
  },
  {
    label: "50%",
    value: 0.5,
    color: "bg-green-100 hover:bg-green-200 text-white",
  },
  {
    label: "75%",
    value: 0.75,
    color: "bg-orange-100 hover:bg-orange-200 text-white",
  },
  {
    label: "Max",
    value: 1,
    color: "bg-purple-100 hover:bg-purple-200 text-white",
  },
];

interface CardSupplyProps {
  data: CuratorType | undefined;
  isLoading?: boolean;
  className?: string;
}

export default function CardSupply({
  data,
  isLoading = false,
  className,
}: CardSupplyProps) {
  const [showDialog, setShowDialog] = useState(false);

  const { bNormalized, bLoading: balanceLoading } = useBalanceUser({
    token: data?.asset as HexAddress,
    chainId: data?.chainId as ChainSupported,
    decimals: 18,
  });

  const [amount, setAmount] = useState("");
  const [focusedPreset, setFocusedPreset] = useState<number | null>(null);

  const rawAmount = useMemo((): number => {
    const cleaned = cleanNumberInput(amount);

    return parseFloat(cleaned) || 0;
  }, [amount]);

  const balanceValue = useMemo(() => bNormalized || 0, [bNormalized]);

  const validationState = useMemo(() => {
    if (!amount) return { isValid: false, message: "" };
    if (rawAmount <= 0)
      return { isValid: false, message: "Amount must be greater than 0" };
    if (rawAmount > balanceValue)
      return { isValid: false, message: "Insufficient balance" };

    return { isValid: true, message: "" };
  }, [rawAmount, balanceValue, amount]);

  const utilizationPercentage = useMemo(() => {
    if (balanceValue === 0) return 0;

    return Math.min((rawAmount / balanceValue) * 100, 100);
  }, [rawAmount, balanceValue]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const formatted = formatAmountInput(input, 18);

      setAmount(formatted);
    },
    [],
  );

  const handlePresetClick = useCallback(
    (preset: (typeof AMOUNT_PRESETS)[0]) => {
      const presetAmount = balanceValue * preset.value;

      setAmount(formatAmountInput(presetAmount.toString(), 18));
      setFocusedPreset(preset.value);

      setTimeout(() => setFocusedPreset(null), 200);
    },
    [balanceValue],
  );

  const { mutation, txHash, currentStepIndex, loadingStates } =
    useSupplyCurator({
      curatorAddress: data?.curator as HexAddress,
    });

  const handleSupply = useCallback(() => {
    if (validationState.isValid) {
      mutation.mutate(
        {
          tokenAddress: data?.asset as HexAddress,
          amount: rawAmount,
          decimals: 18,
          chainId: data?.chainId as ChainSupported,
        },
        {
          onSuccess: () => {
            setShowDialog(true);
            setAmount("");
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          },
        },
      );
    }
  }, [validationState.isValid, rawAmount]);

  const handleMaxBalance = useCallback(() => {
    setAmount(formatAmountInput(balanceValue.toString(), 18));
  }, [balanceValue]);

  return (
    <TooltipProvider>
      <React.Fragment>
        <DialogTransaction
          chainId={data?.chainId as ChainSupported}
          isOpen={showDialog}
          processName="Supply"
          txHash={(txHash as HexAddress) || ""}
          onClose={() => {
            setShowDialog(false);
          }}
        />
        <MultiStepLoader
          loading={mutation.isPending}
          loadingStates={loadingStates}
          loop={false}
          value={currentStepIndex}
        />

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
                    Supply Pools
                  </CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Manage your lending positions across pools
                </CardDescription>
              </div>
              {data?.asset && (
                <Badge className="text-sm" variant="outline">
                  Active
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="w-4 h-4" />
                  <span>Available Balance</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your current wallet balance for this token</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-2">
                  {balanceLoading ? (
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  ) : (
                    <>
                      <span className="font-medium">
                        {formatCompactNumber(balanceValue, 2)}
                      </span>
                      <Button
                        className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                        size="sm"
                        variant="ghost"
                        onClick={handleMaxBalance}
                      >
                        MAX
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {amount && (
                <div className="space-y-2">
                  <Progress className="h-2" value={utilizationPercentage} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Using {utilizationPercentage.toFixed(1)}% of balance
                    </span>
                    <span>
                      {formatCompactNumber(balanceValue - rawAmount, 2)}{" "}
                      remaining
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Input
                  className={cn(
                    "h-14 text-lg font-medium pr-12 transition-all duration-200",
                    "focus:ring-2 focus:ring-primary/20",
                    validationState.message &&
                      !validationState.isValid &&
                      "border-destructive focus:ring-destructive/20",
                  )}
                  disabled={isLoading || balanceLoading}
                  placeholder="0.00"
                  type="text"
                  value={amount}
                  onChange={handleInputChange}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <TokenImageCustom
                    address={data?.asset}
                    className="w-6 h-6 ring-2 ring-background shadow-sm"
                  />
                </div>
              </div>

              {validationState.message && (
                <Alert
                  variant={validationState.isValid ? "default" : "destructive"}
                >
                  <AlertDescription className="text-sm">
                    {validationState.message}
                  </AlertDescription>
                </Alert>
              )}

              {amount && validationState.isValid && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Supply Amount:</span>
                  <span className="font-medium">
                    {formatCompactNumber(rawAmount, 2)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Quick Select
              </p>
              <div className="grid grid-cols-4 gap-2">
                {AMOUNT_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    className={cn(
                      "transition-all duration-200 font-medium",
                      preset.color,
                      focusedPreset === preset.value && "scale-95",
                      "hover:scale-105 active:scale-95",
                    )}
                    disabled={isLoading || balanceLoading || balanceValue === 0}
                    size="sm"
                    variant="outline"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              className={cn(
                "w-full h-12 text-base font-medium transition-all duration-200",
                "hover:scale-[1.01] active:scale-[0.98]",
                validationState.isValid && "bg-primary hover:bg-primary/90",
              )}
              disabled={!validationState.isValid || isLoading || balanceLoading}
              onClick={handleSupply}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span>Supply </span>
                  <span>
                    {amount &&
                      validationState.isValid &&
                      `${formatCompactNumber(rawAmount, 2)}`}
                  </span>
                  <TokenSymbol address={data?.asset} className="font-medium" />
                </div>
              )}
            </Button>

            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <Info className="w-3 h-3 mr-1" />
              <span>Transaction fees may apply</span>
            </div>
          </CardContent>
        </Card>
      </React.Fragment>
    </TooltipProvider>
  );
}
