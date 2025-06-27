"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Check, ChevronDown, Info } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreatePoolType } from "@/types/form/create-pool.type";
import { contractAddresses } from "@/lib/constants";

interface Step2IrmOracleProps {
  form: UseFormReturn<CreatePoolType>;
}

export default function Step2IrmOracle({ form }: Step2IrmOracleProps) {
  const [irmDialogOpen, setIrmDialogOpen] = useState(false);
  const [oracleDialogOpen, setOracleDialogOpen] = useState(false);

  form.watch("irmModel");
  form.watch("oracleProvider");

  const chainId = form.watch("chainId");

  const { irms = [], oracles = [] } =
    contractAddresses[
      String(chainId) as unknown as keyof typeof contractAddresses
    ] ?? {};

  const formatAddress = (address: string) => {
    if (!address) return "";

    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleIrmSelect = (value: string) => {
    form.setValue("irmModel", value);
    setIrmDialogOpen(false);
  };

  const handleOracleSelect = (value: string) => {
    form.setValue("oracleProvider", value);
    setOracleDialogOpen(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Interest Rate Model & Oracle Configuration
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure the interest rate model and price oracle for your pool
          </p>
        </div>

        {/* Interest Rate Model Selection */}
        <FormField
          control={form.control}
          name="irmModel"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">
                  Interest Rate Model
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      The interest rate model determines how borrowing and
                      lending rates are calculated based on pool utilization
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Card
                className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                  field.value ? "border-primary" : "border-dashed"
                }`}
              >
                <Dialog open={irmDialogOpen} onOpenChange={setIrmDialogOpen}>
                  <DialogTrigger asChild>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex flex-col space-y-1 flex-1">
                        <span className="text-sm font-medium">
                          {field.value
                            ? "Interest Rate Model Selected"
                            : "Select Interest Rate Model"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {field.value
                            ? formatAddress(field.value)
                            : "Choose from available models"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {field.value && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </DialogTrigger>

                  <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select Interest Rate Model</DialogTitle>
                    </DialogHeader>

                    {irms.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No interest rate models available for this chain</p>
                      </div>
                    ) : (
                      <RadioGroup
                        className="space-y-3"
                        value={field.value}
                        onValueChange={handleIrmSelect}
                      >
                        {irms.map((irm, index) => (
                          <div key={irm} className="relative">
                            <RadioGroupItem
                              className="peer sr-only"
                              id={`irm-${index}`}
                              value={irm}
                            />
                            <Label
                              className="flex cursor-pointer"
                              htmlFor={`irm-${index}`}
                            >
                              <Card className="w-full transition-colors hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                      IRM Model #{index + 1}
                                    </CardTitle>
                                    {field.value === irm && (
                                      <Check className="h-4 w-4 text-primary" />
                                    )}
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-xs text-muted-foreground font-mono break-all">
                                    {irm}
                                  </p>
                                </CardContent>
                              </Card>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    <FormMessage />
                  </DialogContent>
                </Dialog>
              </Card>
            </FormItem>
          )}
        />

        {/* Oracle Provider Selection */}
        <FormField
          control={form.control}
          name="oracleProvider"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Oracle Provider</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      The oracle provides real-time price data for assets in
                      your pool
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Card
                className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                  field.value ? "border-primary" : "border-dashed"
                }`}
              >
                <Dialog
                  open={oracleDialogOpen}
                  onOpenChange={setOracleDialogOpen}
                >
                  <DialogTrigger asChild>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex flex-col space-y-1 flex-1">
                        <span className="text-sm font-medium">
                          {field.value
                            ? "Oracle Provider Selected"
                            : "Select Oracle Provider"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {field.value
                            ? formatAddress(field.value)
                            : "Choose from available oracles"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {field.value && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </DialogTrigger>

                  <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select Oracle Provider</DialogTitle>
                    </DialogHeader>

                    {oracles.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No oracle providers available for this chain</p>
                      </div>
                    ) : (
                      <RadioGroup
                        className="space-y-3"
                        value={field.value}
                        onValueChange={handleOracleSelect}
                      >
                        {oracles.map((oracle, index) => (
                          <div key={oracle} className="relative">
                            <RadioGroupItem
                              className="peer sr-only"
                              id={`oracle-${index}`}
                              value={oracle}
                            />
                            <Label
                              className="flex cursor-pointer"
                              htmlFor={`oracle-${index}`}
                            >
                              <Card className="w-full transition-colors hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                      Oracle #{index + 1}
                                    </CardTitle>
                                    {field.value === oracle && (
                                      <Check className="h-4 w-4 text-primary" />
                                    )}
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-xs text-muted-foreground font-mono break-all">
                                    {oracle}
                                  </p>
                                </CardContent>
                              </Card>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    <FormMessage />
                  </DialogContent>
                </Dialog>
              </Card>
            </FormItem>
          )}
        />
      </div>
    </TooltipProvider>
  );
}
