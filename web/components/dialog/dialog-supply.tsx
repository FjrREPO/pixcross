"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
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

interface SupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  pools: Pool[];
}

export default function DialogSupply({
  isOpen,
  onClose,
  pools,
}: SupplyModalProps) {
  const [selectedPool, setSelectedPool] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"input" | "confirm" | "success">("input");
  const [walletBalance] = useState(1000.5); // Mock wallet balance

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedPool("");
      setAmount("");
      setStep("input");
      setIsLoading(false);
    }
  }, [isOpen]);

  const selectedPoolData = pools.find((pool) => pool.id === selectedPool);
  const amountNumber = parseFloat(amount) || 0;
  const isValidAmount = amountNumber > 0 && amountNumber <= walletBalance;

  // Calculate estimated earnings
  const estimatedApy = selectedPoolData
    ? parseFloat(selectedPoolData.supplyApy || "0")
    : 0;
  const estimatedYearlyEarnings = (amountNumber * estimatedApy) / 100;
  const estimatedMonthlyEarnings = estimatedYearlyEarnings / 12;

  const handleMaxClick = () => {
    setAmount(walletBalance.toString());
  };

  const handleSupply = async () => {
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

  const formatPercentage = (value: string | undefined) => {
    return value ? `${parseFloat(value).toFixed(2)}%` : "0.00%";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-violet-600" />
            Supply Assets
          </DialogTitle>
          <DialogDescription>
            Supply your assets to earn interest from the lending pool
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-6">
            {/* Pool Selection */}
            <div className="space-y-2">
              <Label htmlFor="pool-select">Select Pool</Label>
              <Select value={selectedPool} onValueChange={setSelectedPool}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lending pool" />
                </SelectTrigger>
                <SelectContent>
                  {pools.map((pool) => (
                    <SelectItem key={pool.id} value={pool.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {pool.name || `Pool ${pool.id.slice(0, 8)}`}
                        </span>
                        <Badge className="ml-2" variant="secondary">
                          {formatPercentage(pool.supplyApy)} APY
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pool Details */}
            {selectedPoolData && (
              <Card className="bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Supply APY
                      </p>
                      <p className="font-semibold text-green-600">
                        {formatPercentage(selectedPoolData.supplyApy)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Utilization
                      </p>
                      <p className="font-semibold">
                        {formatPercentage(selectedPoolData.utilizationRate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">LTV</p>
                      <p className="font-semibold">{selectedPoolData.ltv}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">LTH</p>
                      <p className="font-semibold">{selectedPoolData.lth}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Wallet className="w-4 h-4" />
                  Balance: {formatCurrency(walletBalance)}
                </div>
              </div>
              <div className="relative">
                <Input
                  className="pr-16"
                  id="amount"
                  min="0"
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
              {amount && !isValidAmount && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {amountNumber > walletBalance
                      ? "Amount exceeds wallet balance"
                      : "Please enter a valid amount"}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Estimated Earnings */}
            {isValidAmount && selectedPoolData && (
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Estimated Earnings
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Monthly
                      </p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(estimatedMonthlyEarnings)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Yearly</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(estimatedYearlyEarnings)}
                      </p>
                    </div>
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
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                disabled={!isValidAmount || !selectedPool}
                onClick={handleSupply}
              >
                Supply {amount && formatCurrency(amountNumber)}
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-6 text-center">
            {isLoading ? (
              <>
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-violet-600" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Confirming Transaction
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
                        <span>Amount:</span>
                        <span className="font-semibold">
                          {formatCurrency(amountNumber)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pool:</span>
                        <span className="font-semibold">
                          {selectedPoolData?.name ||
                            `Pool ${selectedPool.slice(0, 8)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>APY:</span>
                        <span className="font-semibold text-green-600">
                          {formatPercentage(selectedPoolData?.supplyApy)}
                        </span>
                      </div>
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
                  Supply Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your assets have been successfully supplied to the pool
                </p>
              </div>
            </div>

            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Supplied Amount:</span>
                    <span className="font-semibold">
                      {formatCurrency(amountNumber)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current APY:</span>
                    <span className="font-semibold text-green-600">
                      {formatPercentage(selectedPoolData?.supplyApy)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Monthly Earnings:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(estimatedMonthlyEarnings)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
