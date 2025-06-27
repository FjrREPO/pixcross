"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowDownRight,
  Wallet,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Loader2,
  Info,
  AlertTriangle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Pool {
  id: string;
  name?: string;
  symbol?: string;
  supplyApy?: string;
  borrowApy?: string;
  totalSupplyAssets?: string;
  totalBorrowAssets?: string;
  utilizationRate?: string;
  ltv?: string;
  lth?: string;
  collateralFactor?: string;
}

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  pools: Pool[];
}

// Mock user positions
const mockPositions = [
  {
    poolId: "pool1",
    suppliedAmount: 500.25,
    earnedInterest: 12.43,
    apy: 4.2,
  },
  {
    poolId: "pool2",
    suppliedAmount: 750.8,
    earnedInterest: 18.67,
    apy: 3.8,
  },
];

export default function DialogWithdraw({
  isOpen,
  onClose,
  pools,
}: WithdrawModalProps) {
  const [selectedPool, setSelectedPool] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"input" | "confirm" | "success">("input");
  const [, setWithdrawType] = useState<"partial" | "full">("partial");

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedPool("");
      setAmount("");
      setStep("input");
      setIsLoading(false);
      setWithdrawType("partial");
    }
  }, [isOpen]);

  const selectedPosition = mockPositions.find(
    (pos) => pos.poolId === selectedPool,
  );
  const selectedPoolData = pools.find((pool) => pool.id === selectedPool);
  const amountNumber = parseFloat(amount) || 0;
  const maxWithdrawable = selectedPosition
    ? selectedPosition.suppliedAmount + selectedPosition.earnedInterest
    : 0;
  const isValidAmount = amountNumber > 0 && amountNumber <= maxWithdrawable;

  // Calculate remaining balance after withdrawal
  const remainingBalance = maxWithdrawable - amountNumber;
  const isFullWithdrawal = amountNumber >= maxWithdrawable * 0.99; // 99% threshold for full withdrawal

  const handleMaxClick = () => {
    if (selectedPosition) {
      setAmount(maxWithdrawable.toString());
      setWithdrawType("full");
    }
  };

  const handleWithdraw = async () => {
    if (!isValidAmount || !selectedPool) return;

    setIsLoading(true);
    setStep("confirm");

    // Simulate transaction
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
    }, 3000);
  };

  const handleClose = () => {
    if (step === "success") {
      setStep("input");
    }
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: string | number | undefined) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value || 0;

    return `${numValue.toFixed(2)}%`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowDownRight className="w-5 h-5 text-orange-600" />
            Withdraw Assets
          </DialogTitle>
          <DialogDescription>
            Withdraw your supplied assets and earned interest from lending pools
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-6">
            {/* Pool Selection */}
            <div className="space-y-2">
              <Label htmlFor="pool-select">Select Position</Label>
              <Select value={selectedPool} onValueChange={setSelectedPool}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a position to withdraw from" />
                </SelectTrigger>
                <SelectContent>
                  {mockPositions.map((position) => {
                    const poolData = pools.find(
                      (p) => p.id === position.poolId,
                    );

                    return (
                      <SelectItem key={position.poolId} value={position.poolId}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {poolData?.name || `Pool ${position.poolId}`}
                          </span>
                          <Badge className="ml-2" variant="secondary">
                            {formatCurrency(
                              position.suppliedAmount + position.earnedInterest,
                            )}
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* No positions message */}
            {mockPositions.length === 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  You don&apos;t have any active supply positions. Supply assets
                  first to be able to withdraw.
                </AlertDescription>
              </Alert>
            )}

            {/* Position Details */}
            {selectedPosition && selectedPoolData && (
              <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Position Summary</h4>
                      <Badge variant="outline">
                        {formatPercentage(selectedPosition.apy)} APY
                      </Badge>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Principal
                        </p>
                        <p className="font-semibold">
                          {formatCurrency(selectedPosition.suppliedAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Interest Earned
                        </p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(selectedPosition.earnedInterest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Total Available
                        </p>
                        <p className="font-semibold text-blue-600">
                          {formatCurrency(maxWithdrawable)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Pool Utilization
                        </p>
                        <p className="font-semibold">
                          {formatPercentage(selectedPoolData.utilizationRate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amount Input */}
            {selectedPosition && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount">Withdrawal Amount</Label>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Wallet className="w-4 h-4" />
                    Available: {formatCurrency(maxWithdrawable)}
                  </div>
                </div>
                <div className="relative">
                  <Input
                    className="pr-16"
                    id="amount"
                    max={maxWithdrawable}
                    min="0"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      const val = parseFloat(e.target.value) || 0;

                      setWithdrawType(
                        val >= maxWithdrawable * 0.99 ? "full" : "partial",
                      );
                    }}
                  />
                  <Button
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs"
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={handleMaxClick}
                  >
                    MAX
                  </Button>
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((percentage) => (
                    <Button
                      key={percentage}
                      className="flex-1 text-xs"
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const calcAmount = (maxWithdrawable * percentage) / 100;

                        setAmount(calcAmount.toString());
                        setWithdrawType(
                          percentage === 100 ? "full" : "partial",
                        );
                      }}
                    >
                      {percentage}%
                    </Button>
                  ))}
                </div>

                {amount && !isValidAmount && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {amountNumber > maxWithdrawable
                        ? "Amount exceeds available balance"
                        : "Please enter a valid amount"}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Withdrawal Impact */}
            {isValidAmount && selectedPosition && (
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                      Withdrawal Impact
                    </h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Withdrawing:</span>
                      <span className="font-semibold">
                        {formatCurrency(amountNumber)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining in pool:</span>
                      <span className="font-semibold">
                        {formatCurrency(remainingBalance)}
                      </span>
                    </div>
                    {!isFullWithdrawal && (
                      <div className="flex justify-between">
                        <span>Future monthly earnings:</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(
                            (remainingBalance * selectedPosition.apy) /
                              100 /
                              12,
                          )}
                        </span>
                      </div>
                    )}
                    {isFullWithdrawal && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          This will close your position completely. You&apos;ll
                          stop earning interest.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                disabled={!isValidAmount || !selectedPool}
                onClick={handleWithdraw}
              >
                Withdraw {amount && formatCurrency(amountNumber)}
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-6 text-center">
            {isLoading ? (
              <>
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Confirming Withdrawal
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Please confirm the transaction in your wallet
                    </p>
                  </div>
                </div>

                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Withdrawal Amount:</span>
                        <span className="font-semibold">
                          {formatCurrency(amountNumber)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>From Pool:</span>
                        <span className="font-semibold">
                          {selectedPoolData?.name ||
                            `Pool ${selectedPool.slice(0, 8)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-semibold">
                          {isFullWithdrawal
                            ? "Full Withdrawal"
                            : "Partial Withdrawal"}
                        </span>
                      </div>
                      {!isFullWithdrawal && (
                        <div className="flex justify-between">
                          <span>Remaining:</span>
                          <span className="font-semibold">
                            {formatCurrency(remainingBalance)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Withdrawal Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your assets have been successfully withdrawn
                </p>
              </div>
            </div>

            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Transaction Details
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Withdrawn:</span>
                    <span className="font-semibold">
                      {formatCurrency(amountNumber)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>From Pool:</span>
                    <span className="font-semibold">
                      {selectedPoolData?.name ||
                        `Pool ${selectedPool.slice(0, 8)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Type:</span>
                    <span className="font-semibold">
                      {isFullWithdrawal
                        ? "Full Withdrawal"
                        : "Partial Withdrawal"}
                    </span>
                  </div>
                  {!isFullWithdrawal && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span>Remaining Balance:</span>
                        <span className="font-semibold">
                          {formatCurrency(remainingBalance)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Continue Earning:</span>
                        <span className="font-semibold text-green-600">
                          {formatPercentage(selectedPosition?.apy)} APY
                        </span>
                      </div>
                    </>
                  )}
                  {isFullWithdrawal && (
                    <>
                      <Separator />
                      <div className="text-center text-gray-600 dark:text-gray-400">
                        Position closed. You can supply again anytime to start
                        earning.
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={handleClose}
              >
                View Portfolio
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleClose}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
