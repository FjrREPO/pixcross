import React from "react";
import { Trash2, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { PoolType } from "@/types/graphql/pool.type";
import { chainMetaMap } from "@/data/chains.data";
import { TokenSymbol } from "@/components/token/token-symbol";

interface PoolSelectionStepProps {
  pools: PoolType[];
  fields: Array<{ id: string; poolId: string; allocation: number }>;
  totalAllocation: number;
  isAllocationValid: boolean;
  onPoolToggle: (poolId: string, checked: boolean) => void;
  onAllocationChange: (index: number, value: number[]) => void;
  onAutoBalance: () => void;
  onClearAll: () => void;
  onRemovePool: (index: number) => void;
}

export function PoolSelectionStep({
  pools,
  fields,
  totalAllocation,
  isAllocationValid,
  onPoolToggle,
  onAllocationChange,
  onAutoBalance,
  onClearAll,
  onRemovePool,
}: PoolSelectionStepProps) {
  const findPoolById = (poolId: string): PoolType | undefined => {
    return pools.find(
      (pool: PoolType) =>
        String(pool.id) === String(poolId) ||
        pool.id.toLowerCase() === poolId.toLowerCase(),
    );
  };

  return (
    <FormItem>
      <div className="flex items-center justify-between mb-6">
        <div>
          <FormLabel className="text-xl font-semibold">
            Select Pools & Set Allocations
          </FormLabel>
          <p className="text-sm text-muted-foreground mt-1">
            Choose pools and distribute your investment allocation
          </p>
        </div>
        {fields.length > 1 && (
          <div className="flex space-x-2">
            <Button
              className="hover:bg-primary transition-colors"
              size="sm"
              type="button"
              variant="outline"
              onClick={onAutoBalance}
            >
              <div className="w-4 h-4 mr-1">⚖️</div>
              Auto Balance
            </Button>
            <Button
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
              size="sm"
              type="button"
              variant="outline"
              onClick={onClearAll}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pools.map((pool: PoolType) => {
          const isSelected = fields.some((field) => field.poolId === pool.id);
          const fieldIndex = fields.findIndex(
            (field) => field.poolId === pool.id,
          );

          const findChain =
            pool.chainId !== undefined ? chainMetaMap[pool.chainId] : undefined;

          return (
            <Card
              key={pool.id}
              className={`group relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? "ring-2 ring-primary shadow-md bg-primary/5"
                  : "hover:shadow-md hover:bg-accent/20"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </div>
              )}

              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative mt-1">
                      <Checkbox
                        checked={isSelected}
                        className="hidden"
                        disabled={isSelected}
                        onCheckedChange={(checked) => {
                          if (!isSelected && checked) {
                            onPoolToggle(pool.id, true);
                          } else if (isSelected && !checked) {
                            onPoolToggle(pool.id, false);
                          }
                        }}
                      />
                    </div>

                    <div
                      aria-pressed={isSelected}
                      className="flex-1 min-w-0 cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => onPoolToggle(pool.id, !isSelected)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onPoolToggle(pool.id, !isSelected);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="relative">
                          <TokenImageCustom
                            address={
                              pool.collateralToken?.collateralToken || ""
                            }
                            className="w-10 h-10 rounded-full border-2 border-background shadow-sm"
                          />
                          {findChain && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background overflow-hidden">
                              <Image
                                alt={findChain.name || "Chain Icon"}
                                className="w-full h-full object-cover"
                                height={20}
                                src={findChain.icon || ""}
                                width={20}
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-sm truncate">
                            {pool.collateralAddress}
                          </h4>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {findChain ? findChain.name : "Unknown Chain"}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                            <span className="text-xs text-muted-foreground">
                              <TokenSymbol address={pool.loanAddress} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isSelected && fieldIndex !== -1 && (
                    <div className="space-y-3 pt-3 border-t border-muted/50">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium flex items-center space-x-1">
                          <span>Allocation</span>
                          <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs text-primary">%</span>
                          </div>
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            className="w-16 h-7 text-xs text-center"
                            max="100"
                            min="0"
                            step="0.1"
                            type="number"
                            value={fields[fieldIndex].allocation}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;

                              onAllocationChange(fieldIndex, [
                                Math.min(100, Math.max(0, value)),
                              ]);
                            }}
                          />
                          <span className="text-sm font-bold text-primary">
                            %
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Slider
                          className="w-full"
                          max={100}
                          step={0.1}
                          value={[fields[fieldIndex].allocation]}
                          onValueChange={(value) =>
                            onAllocationChange(fieldIndex, value)
                          }
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      <div className="flex space-x-1">
                        {[10, 25, 50].map((percent) => (
                          <Button
                            key={percent}
                            className="text-xs px-2 py-1 h-6"
                            size="sm"
                            type="button"
                            variant="outline"
                            onClick={() =>
                              onAllocationChange(fieldIndex, [percent])
                            }
                          >
                            {percent}%
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <FormDescription className="text-center">
        Select pools to include in your curator and set their allocation
        percentages.
        <br />
        <span className="text-xs text-muted-foreground">
          Tip: Use quick allocation buttons or drag sliders for precise control
        </span>
      </FormDescription>
      <FormMessage />

      {fields.length > 0 && (
        <Card className="border-2 bg-gradient-to-br from-background to-muted/20 mt-6">
          <CardHeader>
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">
                  Selected Pools Summary
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fields.map((field, index) => {
                const pool = findPoolById(field.poolId);

                if (!pool) {
                  return (
                    <div
                      key={field.id}
                      className="group flex items-center justify-between p-4 rounded-xl bg-background border border-destructive/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-destructive">
                            Pool not found
                          </span>
                          <div className="text-xs text-muted-foreground">
                            ID: {field.id}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-bold text-lg text-primary">
                            {field.allocation.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            allocation
                          </div>
                        </div>
                        <Button
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                          size="sm"
                          type="button"
                          variant="ghost"
                          onClick={() => onRemovePool(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                }

                const findChain =
                  pool.chainId !== undefined
                    ? chainMetaMap[pool.chainId]
                    : undefined;

                return (
                  <div
                    key={field.id}
                    className="group flex items-center justify-between p-4 rounded-xl bg-background border hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <TokenImageCustom
                          address={pool.collateralToken?.collateralToken || ""}
                          className="w-8 h-8 rounded-full border-2 border-background shadow-sm"
                        />
                        {findChain && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background overflow-hidden">
                            <Image
                              alt={findChain.name || "Chain Icon"}
                              className="w-full h-full object-cover"
                              height={20}
                              src={findChain.icon || ""}
                              width={20}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-sm">
                          {pool.collateralAddress}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {findChain ? findChain.name : "Unknown Chain"} - Pool
                          #{pool.id.slice(-4)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-bold text-lg text-primary">
                          {field.allocation.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          allocation
                        </div>
                      </div>
                      <Button
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                        size="sm"
                        type="button"
                        variant="ghost"
                        onClick={() => onRemovePool(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-muted/50">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {fields.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Pools Selected
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {totalAllocation.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Allocated
                  </div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold ${isAllocationValid ? "text-green-600" : "text-amber-600"}`}
                  >
                    {isAllocationValid
                      ? "✓"
                      : (100 - totalAllocation).toFixed(1) + "%"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isAllocationValid ? "Complete" : "Remaining"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </FormItem>
  );
}

export default PoolSelectionStep;
