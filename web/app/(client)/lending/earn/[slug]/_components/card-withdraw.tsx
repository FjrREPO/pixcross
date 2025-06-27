import { Info, TrendingDown } from "lucide-react";
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
import {
  cleanNumberInput,
  formatAmountInput,
  formatCompactNumber,
} from "@/lib/helper/number";
import { cn } from "@/lib/utils";
import { useWithdrawCurator } from "@/hooks/mutation/contract/curator/use-withdraw-curator";
import DialogTransaction from "@/components/dialog/dialog-transaction";
import { MultiStepLoader } from "@/components/loader/multi-step-loader";
import { normalize } from "@/lib/helper/bignumber";
import { BalanceType } from "@/types/graphql/balance.type";

const AMOUNT_PRESETS = [
  {
    label: "25%",
    value: 0.25,
    color: "bg-red-100 hover:bg-red-200 text-white",
  },
  {
    label: "50%",
    value: 0.5,
    color: "bg-orange-100 hover:bg-orange-200 text-white",
  },
  {
    label: "75%",
    value: 0.75,
    color: "bg-yellow-100 hover:bg-yellow-200 text-white",
  },
  {
    label: "Max",
    value: 1,
    color: "bg-rose-100 hover:bg-rose-200 text-white",
  },
];

interface CardWithdrawProps {
  data: CuratorType | undefined;
  className?: string;
  balanceUser?: BalanceType;
  isLoading?: boolean;
}

export default function CardWithdraw({
  data,
  isLoading,
  balanceUser,
  className,
}: CardWithdrawProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [focusedPreset, setFocusedPreset] = useState<number | null>(null);

  const suppliedBalance = parseFloat(
    normalize(balanceUser?.balance || "0", 18),
  );

  const rawAmount = useMemo((): number => {
    const cleaned = cleanNumberInput(amount);

    return parseFloat(cleaned) || 0;
  }, [amount]);

  const validationState = useMemo(() => {
    if (!amount) return { isValid: false, message: "" };
    if (rawAmount <= 0)
      return { isValid: false, message: "Amount must be greater than 0" };
    if (rawAmount > Number(suppliedBalance))
      return { isValid: false, message: "Insufficient supplied balance" };

    return { isValid: true, message: "" };
  }, [rawAmount, suppliedBalance, amount]);

  const utilizationPercentage = useMemo(() => {
    if (suppliedBalance === 0) return 0;

    return Math.min((rawAmount / Number(suppliedBalance)) * 100, 100);
  }, [rawAmount, suppliedBalance]);

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
      const presetAmount = Number(suppliedBalance) * preset.value;

      setAmount(formatAmountInput(presetAmount.toString(), 18));
      setFocusedPreset(preset.value);
      setTimeout(() => setFocusedPreset(null), 200);
    },
    [suppliedBalance],
  );

  const { mutation, txHash, loadingStates, currentStepIndex } =
    useWithdrawCurator();

  const handleWithdraw = useCallback(() => {
    if (validationState.isValid && mutation) {
      mutation.mutate(
        {
          curatorAddress: data?.curator as HexAddress,
          tokenAddress: data?.asset as HexAddress,
          amount: rawAmount,
          chainId: data?.chainId as ChainSupported,
          decimals: 18,
        },
        {
          onSuccess: () => {
            setShowDialog(true);
            setAmount("");
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          },
        },
      );
    }
  }, [validationState.isValid, rawAmount, mutation]);

  const handleMaxBalance = useCallback(() => {
    setAmount(formatAmountInput(suppliedBalance.toString(), 18));
  }, [suppliedBalance]);

  return (
    <TooltipProvider>
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
        className={cn("transition-all duration-200 hover:shadow-lg", className)}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold">
                  Withdraw Asset
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Withdraw your supplied assets from lending pools
              </CardDescription>
            </div>
            {data?.asset && Number(suppliedBalance) > 0 && (
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
                <TrendingDown className="w-4 h-4" />
                <span>Supplied Balance</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your current supplied balance in this pool</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {formatCompactNumber(suppliedBalance)}
                </span>
                <Button
                  className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                  disabled={suppliedBalance === 0}
                  size="sm"
                  variant="ghost"
                  onClick={handleMaxBalance}
                >
                  MAX
                </Button>
              </div>
            </div>

            {amount && (
              <div className="space-y-2">
                <Progress className="h-2" value={utilizationPercentage} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Withdrawing {utilizationPercentage.toFixed(1)}% of position
                  </span>
                  <span>
                    {formatCompactNumber(
                      Number(suppliedBalance) - rawAmount,
                      2,
                    )}{" "}
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
                disabled={isLoading || suppliedBalance === 0}
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
                <span className="text-muted-foreground">Withdraw Amount:</span>
                <span className="font-medium">
                  {formatCompactNumber(rawAmount, 2)}
                </span>
              </div>
            )}
          </div>

          {Number(suppliedBalance) > 0 && (
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
                    disabled={isLoading || suppliedBalance === 0}
                    size="sm"
                    variant="outline"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {suppliedBalance === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You don&apos;t have any supplied balance to withdraw from this
                pool.
              </AlertDescription>
            </Alert>
          ) : (
            <Button
              className={cn(
                "w-full h-12 text-base font-medium transition-all duration-200",
                "hover:scale-[1.01] active:scale-[0.98]",
                validationState.isValid && "bg-primary hover:bg-primary/90",
              )}
              disabled={!validationState.isValid || isLoading}
              onClick={handleWithdraw}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  Withdraw{" "}
                  {amount &&
                    validationState.isValid &&
                    `${formatCompactNumber(rawAmount, 2)}`}
                </>
              )}
            </Button>
          )}

          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <Info className="w-3 h-3 mr-1" />
            <span>Transaction fees may apply</span>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
