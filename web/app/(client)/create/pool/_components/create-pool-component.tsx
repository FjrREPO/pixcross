"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

import Step0ChainSelection from "./step0-chain-selection";
import Step1TokenSelection from "./step1-token-selection";
import Step2IrmOracle from "./step2-irm-oracle";
import Step3LtvLth from "./step3-ltv-lth";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createPoolSchema,
  CreatePoolType,
} from "@/types/form/create-pool.type";
import { MultiStepLoader } from "@/components/loader/multi-step-loader";
import DialogTransaction from "@/components/dialog/dialog-transaction";
import WalletWrapper from "@/components/wallet/wallet-wrapper";
import { nftMultichainData } from "@/data/nft-multichain.data";
import { tokenMultichainData } from "@/data/token-multichain.data";
import {
  ChainSupported,
  HexAddress,
  FormStep,
  stepValidationConfig,
  isValidChainId,
} from "@/types/form/create-pool.type";
import { chainData } from "@/data/chains.data";
import { useCreatePool } from "@/hooks/mutation/contract/pool/use-create-pool";

interface StepConfig {
  id: number;
  title: string;
  description: string;
}

const steps: StepConfig[] = [
  {
    id: 0,
    title: "Chain Selection",
    description: "Choose the blockchain network",
  },
  {
    id: 1,
    title: "Token Selection",
    description: "Choose collateral and loan tokens",
  },
  {
    id: 2,
    title: "IRM & Oracle",
    description: "Configure interest rates and price feeds",
  },
  {
    id: 3,
    title: "Risk Parameters",
    description: "Set LTV and liquidation thresholds",
  },
];

export default function CreatePoolComponent() {
  const [step, setStep] = useState<FormStep>(0);
  const [showDialog, setShowDialog] = useState(false);

  const form = useForm<CreatePoolType, any, CreatePoolType>({
    resolver: zodResolver(createPoolSchema),
    defaultValues: {
      loanToken: "",
      collateralToken: "",
      irmModel: "",
      oracleProvider: "",
      ltv: 75,
      lth: 0,
      chainId: undefined,
      description: "",
    },
    mode: "onChange",
  });

  const chainId = form.watch("chainId");

  // Step validation logic using improved configuration
  const isStepValid = (stepNumber: FormStep): boolean => {
    const config = stepValidationConfig[stepNumber];

    if (!config) return false;

    // Check required fields
    const requiredFieldsValid = config.requiredFields.every((field) => {
      const value = form.getValues(field);

      return value !== undefined && value !== null && value !== "";
    });

    if (!requiredFieldsValid) return false;

    // Run custom validators if any
    if (config.customValidators) {
      const formData = form.getValues();

      return config.customValidators.every((validator) => {
        const result = validator(formData);

        return result.isValid;
      });
    }

    return true;
  };

  const { mutation, txHash, currentStepIndex, loadingStates } = useCreatePool();

  function onSubmit(values: CreatePoolType) {
    if (!isValidChainId(values.chainId)) {
      return;
    }

    mutation.mutate(
      {
        chainId: chainId as ChainSupported,
        loanToken: values.loanToken as HexAddress,
        collateralToken: values.collateralToken as HexAddress,
        irm: values.irmModel as HexAddress,
        oracle: values.oracleProvider as HexAddress,
        ltv: values.ltv,
        lth: values.lth,
      },
      {
        onSuccess: () => {
          setShowDialog(true);
          setStep(0);
          form.reset();
        },
      },
    );
  }

  // const currentStepConfig = steps.find((s) => s.id === step);
  // const completedSteps = step;
  // const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <WalletWrapper>
      <DialogTransaction
        chainId={chainId as ChainSupported}
        isOpen={showDialog}
        processName="Create Pool"
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

      <div className="pt-30 pb-20 max-w-4xl mx-auto">
        <div className="px-4 md:px-8">
          <Card className="bg-background/70 h-fit">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create Pool</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create a new pool with custom parameters. Configure blockchain,
                tokens, interest rates, oracles, and risk parameters to launch
                your pool.
              </p>

              {/* <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Step {step + 1} of {steps.length}:{" "}
                    {currentStepConfig?.title}
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round(progressPercentage)}% Complete
                  </span>
                </div>
                <Progress className="h-2" value={progressPercentage} />
              </div> */}

              <div className="flex items-center justify-between mt-6">
                {steps.map((stepConfig, index) => (
                  <div key={stepConfig.id} className="flex items-center">
                    <div
                      className={`flex items-center ${
                        step >= stepConfig.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium transition-colors ${
                          step > stepConfig.id
                            ? "bg-primary text-primary-foreground"
                            : step === stepConfig.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                        }`}
                      >
                        {step > stepConfig.id ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          stepConfig.id + 1
                        )}
                      </div>
                      <div className="ml-3 text-left hidden sm:block">
                        <p className="text-sm font-medium">
                          {stepConfig.title}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-px bg-muted mx-4 min-w-8" />
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  className="space-y-8"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="min-h-40">
                    {step === 0 && (
                      <Step0ChainSelection chains={chainData} form={form} />
                    )}

                    {step === 1 && (
                      <Step1TokenSelection
                        chainId={chainId as ChainSupported}
                        collateralTokens={nftMultichainData}
                        form={form}
                        isLoadingCollateralTokens={false}
                        isLoadingLoanTokens={false}
                        loanTokens={tokenMultichainData}
                      />
                    )}

                    {step === 2 && <Step2IrmOracle form={form} />}

                    {step === 3 && <Step3LtvLth form={form} />}
                  </div>

                  <div className="flex flex-row items-center justify-between space-x-2 pt-6 border-t">
                    <Button
                      className="min-w-20"
                      disabled={step === 0}
                      type="button"
                      variant="outline"
                      onClick={() => setStep(Math.max(0, step - 1) as FormStep)}
                    >
                      Back
                    </Button>

                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1 sm:hidden">
                        {steps.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              step > index
                                ? "bg-primary"
                                : step === index
                                  ? "bg-primary"
                                  : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>

                      {step < steps.length - 1 ? (
                        <Button
                          className="min-w-20"
                          disabled={!isStepValid(step)}
                          type="button"
                          onClick={() => setStep((step + 1) as FormStep)}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          className="min-w-32"
                          disabled={
                            !isStepValid(step) ||
                            !form.formState.isValid ||
                            mutation.isPending
                          }
                          type="submit"
                        >
                          {mutation.isPending ? "Creating..." : "Create Pool"}
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
