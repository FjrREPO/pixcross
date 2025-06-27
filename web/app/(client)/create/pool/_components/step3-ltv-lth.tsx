"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Info, AlertTriangle, Target, Percent } from "lucide-react";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreatePoolType } from "@/types/form/create-pool.type";
import { useLTVsByChainId } from "@/hooks/query/graphql/use-ltvs-by-chain-id";

interface Step3LtvLthProps {
  form: UseFormReturn<CreatePoolType>;
}

export const ltvSchema = z.object({
  blockNumber: z.number(),
  blockTimestamp: z.number(),
  id: z.string(),
  ltv: z.number(),
  transactionHash: z.string(),
  chainId: z.number().optional(),
});

export default function Step3LtvLth({ form }: Step3LtvLthProps) {
  const [ltvDialogOpen, setLtvDialogOpen] = useState(false);
  const [lthDialogOpen, setLthDialogOpen] = useState(false);

  const { data } = useLTVsByChainId({
    chainId: form.watch("chainId") as ChainSupported,
  });

  const ltv = form.watch("ltv") || 75;
  const lth = form.watch("lth") || 0;

  const availableLtvs = data
    ? [...new Set(data.map((item) => item.ltv))].sort((a, b) => a - b)
    : [50, 60, 70, 75, 80, 85, 90];

  const getRiskLevel = (value: number, type: "ltv" | "lth") => {
    if (type === "ltv") {
      if (value <= 60)
        return { level: "Conservative", color: "text-green-600" };
      if (value <= 75) return { level: "Moderate", color: "text-yellow-600" };

      return { level: "Aggressive", color: "text-red-600" };
    } else {
      if (value <= 80)
        return { level: "Conservative", color: "text-green-600" };
      if (value <= 90) return { level: "Moderate", color: "text-yellow-600" };

      return { level: "Aggressive", color: "text-red-600" };
    }
  };

  const ltvRisk = getRiskLevel(ltv, "ltv");
  const lthRisk = getRiskLevel(lth, "lth");

  const getWarningMessage = () => {
    if (lth <= ltv) {
      return "Warning: Liquidation threshold should be higher than LTV ratio";
    }
    if (lth - ltv < 5) {
      return "Warning: Small buffer between LTV and liquidation threshold increases liquidation risk";
    }

    return null;
  };

  const warningMessage = getWarningMessage();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Risk Parameters Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Set the Loan-to-Value ratio and Liquidation threshold for your pool
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            Loan-to-Value Ratio (LTV)
          </Label>
          <Dialog open={ltvDialogOpen} onOpenChange={setLtvDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Info className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Loan-to-Value Ratio (LTV)</DialogTitle>
                <DialogDescription>
                  Understanding LTV and how it affects your pool&apos;s risk
                  profile
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">What is LTV?</h4>
                  <p className="text-sm text-muted-foreground">
                    LTV determines the maximum amount users can borrow against
                    their collateral. A 75% LTV means users can borrow up to 75%
                    of their collateral&apos;s value.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Risk Considerations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Higher LTV = More borrowing capacity but higher
                      liquidation risk
                    </li>
                    <li>
                      • Lower LTV = More conservative but less capital
                      efficiency
                    </li>
                    <li>• Consider collateral volatility when setting LTV</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">LTV Configuration</CardTitle>
              </div>
              <Badge className={ltvRisk.color} variant="outline">
                {ltvRisk.level}
              </Badge>
            </div>
            <CardDescription>
              Select the maximum loan-to-value ratio for borrowers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="ltv"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>LTV Percentage</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Percent className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <FormControl>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => {
                          const numValue = Number(value);

                          field.onChange(numValue);
                          // Ensure LTH is always higher than LTV
                          const currentLth = form.getValues("lth");

                          if (currentLth <= numValue) {
                            form.setValue("lth", numValue + 5);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select LTV percentage" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableLtvs.map((ltvValue) => (
                            <SelectItem
                              key={ltvValue}
                              value={ltvValue.toString()}
                            >
                              {ltvValue}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Conservative (≤60%)</span>
                      <span>Moderate (61-75%)</span>
                      <span>Aggressive (&gt;75%)</span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Impact Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Borrowing Capacity:</span>
                  <span className="font-medium">
                    {ltv}% of collateral value
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Capital Efficiency:</span>
                  <Progress className="w-24 h-2 ml-auto" value={ltv} />
                </div>
                <div className="flex justify-between">
                  <span>Liquidation Buffer:</span>
                  <span className="font-medium">{Math.max(0, lth - ltv)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LTH Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            Liquidation Threshold (LTH)
          </Label>
          <Dialog open={lthDialogOpen} onOpenChange={setLthDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Info className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Liquidation Threshold (LTH)</DialogTitle>
                <DialogDescription>
                  Understanding liquidation thresholds and their importance
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">What is LTH?</h4>
                  <p className="text-sm text-muted-foreground">
                    LTH is the point at which a borrower&apos;s position becomes
                    eligible for liquidation. When collateral value drops and
                    the loan reaches this threshold, liquidators can step in.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Setting Guidelines</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Should be higher than LTV to provide safety buffer
                    </li>
                    <li>
                      • Consider collateral volatility and market conditions
                    </li>
                    <li>
                      • Higher threshold = safer protocol, lower capital
                      efficiency
                    </li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Liquidation Threshold</CardTitle>
              </div>
              <Badge className={lthRisk.color} variant="outline">
                {lthRisk.level}
              </Badge>
            </div>
            <CardDescription>
              Set the liquidation threshold for the pool
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="lth"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>LTH Percentage</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Input
                          className="w-20 text-center"
                          max={98}
                          min={ltv + 1}
                          type="number"
                          value={field.value}
                          onChange={(e) => {
                            const value = Number(e.target.value);

                            field.onChange(value);
                          }}
                        />
                        <Percent className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <FormControl>
                      <Slider
                        className="w-full"
                        max={98}
                        min={ltv + 1}
                        step={1}
                        value={[field.value]}
                        onValueChange={(values) => {
                          if (values[0] > ltv) {
                            field.onChange(values[0]);
                          }
                        }}
                      />
                    </FormControl>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Conservative ({ltv + 1}%)</span>
                      <span>Moderate (85%)</span>
                      <span>Aggressive (98%)</span>
                    </div>
                  </div>
                  <FormDescription>
                    Must be higher than LTV ratio ({ltv}%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Risk Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Safety Buffer:</span>
                  <span className="font-medium">{Math.max(0, lth - ltv)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Liquidation Risk:</span>
                  <Progress className="w-24 h-2 ml-auto" value={lth} />
                </div>
                <div className="flex justify-between">
                  <span>Protocol Safety:</span>
                  <span
                    className={`font-medium ${lth - ltv >= 10 ? "text-green-600" : lth - ltv >= 5 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {lth - ltv >= 10
                      ? "High"
                      : lth - ltv >= 5
                        ? "Medium"
                        : "Low"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {warningMessage && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{warningMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>Configuration Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  LTV Ratio:
                </span>
                <span className="font-medium">{ltv}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Liquidation Threshold:
                </span>
                <span className="font-medium">{lth}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Safety Buffer:
                </span>
                <span className="font-medium">{Math.max(0, lth - ltv)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  LTV Risk Level:
                </span>
                <Badge className={ltvRisk.color} variant="outline">
                  {ltvRisk.level}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  LTH Risk Level:
                </span>
                <Badge className={lthRisk.color} variant="outline">
                  {lthRisk.level}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Overall Risk:
                </span>
                <Badge
                  className={
                    ltvRisk.level === "Aggressive" ||
                    lthRisk.level === "Aggressive"
                      ? "text-red-600"
                      : ltvRisk.level === "Moderate" ||
                          lthRisk.level === "Moderate"
                        ? "text-yellow-600"
                        : "text-green-600"
                  }
                  variant="outline"
                >
                  {ltvRisk.level === "Aggressive" ||
                  lthRisk.level === "Aggressive"
                    ? "High"
                    : ltvRisk.level === "Moderate" ||
                        lthRisk.level === "Moderate"
                      ? "Medium"
                      : "Low"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
