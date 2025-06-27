"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

import { PoolSelectionStep } from "./pool-selection-step";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { usePools } from "@/hooks/query/graphql/use-pools";
import { useLoanTokens } from "@/hooks/query/graphql/use-loan-tokens";
import { TokenSymbol } from "@/components/token/token-symbol";
import { chainMetaMap } from "@/data/chains.data";
import {
  createCuratorSchema,
  CreateCuratorType,
} from "@/types/form/create-curator.type";
import { useCreateCurator } from "@/hooks/mutation/contract/curator/use-create-curator";
import { MultiStepLoader } from "@/components/loader/multi-step-loader";
import DialogTransaction from "@/components/dialog/dialog-transaction";
import Loading from "@/components/loader/loading";
import WalletWrapper from "@/components/wallet/wallet-wrapper";
import { TokenImageCustom } from "@/components/token/token-image-custom";

export default function CreateCuratorComponent() {
  const [step, setStep] = useState(1);
  const [showDialog, setShowDialog] = useState(false);

  const { data: pools = [], isLoading: isLoadingPools } = usePools();
  const { data: loanTokens = [], isLoading: isLoadingLoanTokens } =
    useLoanTokens();

  const form = useForm<CreateCuratorType>({
    resolver: zodResolver(createCuratorSchema),
    defaultValues: {
      name: "",
      symbol: "",
      asset: "",
      assetChainId: undefined,
      pools: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "pools",
  });

  const watchedPools = form.watch("pools");
  const totalAllocation = watchedPools.reduce(
    (sum, pool) => sum + pool.allocation,
    0,
  );
  const isAllocationValid = Math.abs(totalAllocation - 100) < 0.01;

  const name = form.watch("name");
  const symbol = form.watch("symbol");
  const asset = form.watch("asset");

  useEffect(() => {
    if (!asset) return;

    const selectedToken = loanTokens.find((token) => token.loanToken === asset);

    if (selectedToken?.chainId) {
      form.setValue("assetChainId", selectedToken.chainId);
    }
  }, [asset, loanTokens, form]);

  const assetChainId = form.watch("assetChainId");

  const filteredPools = pools.filter(
    (pool) => pool.chainId === assetChainId && pool.loanAddress === asset,
  );

  const stepValidators: Record<number, () => boolean> = {
    1: () => {
      return Boolean(name && symbol && asset);
    },
    2: () => {
      return fields.length > 0 && isAllocationValid;
    },
  };

  const isStepValid = (stepNumber: number): boolean => {
    const validator = stepValidators[stepNumber];

    return validator ? validator() : false;
  };

  const { mutation, txHash, logs, currentStepIndex, loadingStates } =
    useCreateCurator();

  function onSubmit(values: CreateCuratorType) {
    mutation.mutate(
      {
        name: values.name,
        symbol: values.symbol,
        asset: values.asset as HexAddress,
        pools: values.pools,
        chainId: assetChainId as ChainSupported,
      },
      {
        onSuccess: () => {
          setShowDialog(true);
          setStep(1);
          form.reset();
          remove();
        },
      },
    );
  }

  if (isLoadingPools || isLoadingLoanTokens) {
    return <Loading />;
  }

  return (
    <WalletWrapper>
      <DialogTransaction
        chainId={assetChainId as ChainSupported}
        enabledLogs={true}
        isOpen={showDialog}
        logs={logs}
        processName="Mint"
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
      <div className="pt-30 pb-20 max-w-7xl mx-auto">
        <div className="px-4 md:px-8">
          <Card className="bg-background/70 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Create Curator
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Curators are users who can create and manage pools with
                strategic allocations.
              </p>

              <div className="flex items-center space-x-4 mt-4">
                <div
                  className={`flex items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                    className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium ${
                      step >= 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
                  </div>
                  <span className="ml-2 text-sm font-medium">Basic Info</span>
                </div>
                <div className="flex-1 h-px bg-muted" />
                <div
                  className={`flex items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                    className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium ${
                      step >= 2
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    Pool Allocation
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  className="space-y-8"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Curator Name *</FormLabel>
                              <FormControl>
                                <Input
                                  maxLength={10}
                                  placeholder="Enter curator name"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is your public display name that users will
                                see. (max 10 characters)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="symbol"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Symbol *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter curator symbol"
                                  {...field}
                                  maxLength={8}
                                  onChange={(e) =>
                                    field.onChange(e.target.value.toUpperCase())
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                A short identifier for your curator (max 8
                                characters).
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="asset"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Asset *</FormLabel>
                            <FormControl>
                              <RadioGroup
                                className="flex flex-row flex-wrap gap-4"
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                {loanTokens.map((token) => {
                                  const findChain =
                                    token.chainId !== undefined
                                      ? chainMetaMap[token.chainId]
                                      : undefined;

                                  return (
                                    <div
                                      key={token.id}
                                      className="flex items-center space-x-2"
                                    >
                                      <RadioGroupItem
                                        className="peer sr-only"
                                        id={token.id}
                                        value={token.loanToken}
                                      />
                                      <Label
                                        className="flex items-center space-x-3 rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                                        htmlFor={token.id}
                                      >
                                        <div className="sup-asset-pair inline-flex relative pr-2 mr-2">
                                          <span className="sup-asset inline-flex rounded-full overflow-hidden h-8 w-8">
                                            <TokenImageCustom
                                              address={token.loanToken}
                                              className="w-8 h-8"
                                            />
                                          </span>
                                          <span className="sup-asset inline-flex rounded-full overflow-hidden h-5 w-5 absolute bottom-0 bg-neutral-950 right-0">
                                            <Image
                                              alt={
                                                findChain?.name || "Chain Icon"
                                              }
                                              className="object-cover object-center"
                                              height={32}
                                              src={findChain?.icon || ""}
                                              width={32}
                                            />
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <div className="flex flex-row items-center space-x-1">
                                            <TokenSymbol
                                              address={token.loanToken}
                                              className="font-medium"
                                            />
                                            <span>-</span>
                                            <span>
                                              {findChain?.symbol || ""}
                                            </span>
                                          </div>
                                          <span className="text-sm text-muted-foreground">
                                            {token.loanToken.slice(0, 18)}...
                                            {token.loanToken.slice(-4)}
                                          </span>
                                        </div>
                                      </Label>
                                    </div>
                                  );
                                })}
                              </RadioGroup>
                            </FormControl>
                            <FormDescription>
                              Select the primary asset that your curator will
                              manage.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <PoolSelectionStep
                        fields={fields}
                        isAllocationValid={isAllocationValid}
                        pools={filteredPools}
                        totalAllocation={totalAllocation}
                        onAllocationChange={(
                          index: number,
                          value: number[],
                        ) => {
                          update(index, {
                            ...fields[index],
                            allocation: value[0],
                          });
                        }}
                        onAutoBalance={() => {
                          const equalAllocation = Math.floor(
                            100 / fields.length,
                          );
                          const remainder =
                            100 - equalAllocation * fields.length;

                          fields.forEach((field, index) => {
                            const allocation =
                              equalAllocation + (index < remainder ? 1 : 0);

                            update(index, { ...field, allocation });
                          });
                        }}
                        onClearAll={() => {
                          for (let i = fields.length - 1; i >= 0; i--) {
                            remove(i);
                          }
                        }}
                        onPoolToggle={(poolId: string, checked: boolean) => {
                          if (checked) {
                            const exists = fields.some(
                              (field) => field.poolId === poolId,
                            );

                            if (!exists) {
                              const remainingAllocation = Math.max(
                                0,
                                100 - totalAllocation,
                              );

                              append({
                                id: poolId,
                                poolId: poolId,
                                allocation: remainingAllocation,
                              });
                            }
                          } else {
                            const index = fields.findIndex(
                              (field) => field.id === poolId,
                            );

                            if (index !== -1) {
                              remove(index);
                            }
                          }
                        }}
                        onRemovePool={(index: number) => remove(index)}
                      />
                    </div>
                  )}

                  <div className="flex flex-row items-center justify-between space-x-2 pt-6 border-t">
                    <Button
                      disabled={step === 1}
                      type="button"
                      variant="secondary"
                      onClick={() => setStep(Math.max(1, step - 1))}
                    >
                      Back
                    </Button>

                    <div className="flex space-x-2">
                      {step < 2 ? (
                        <Button
                          disabled={!isStepValid(step)}
                          type="button"
                          onClick={() => setStep(step + 1)}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          disabled={
                            !isStepValid(step) || !form.formState.isValid
                          }
                          type="submit"
                        >
                          Create Curator
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </WalletWrapper>
  );
}
