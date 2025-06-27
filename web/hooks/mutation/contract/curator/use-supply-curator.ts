import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";
import { erc20Abi } from "viem";

import { config } from "@/lib/wagmi";
import { denormalize, valueToBigInt } from "@/lib/helper/bignumber";
import { curatorABI } from "@/lib/abis/curator.abi";

type Status = "idle" | "loading" | "success" | "error";
type HexAddress = `0x${string}`;

type Step = {
  step: number;
  text: string;
  status: Status;
  error?: string;
};

export const useSupplyCurator = ({
  curatorAddress,
}: {
  curatorAddress: HexAddress;
}) => {
  const { address: userAddress } = useAccount();
  const currentChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const stepTemplates: Step[] = [
    { step: 1, text: "Preparing transaction", status: "idle" },
    { step: 2, text: "Checking token allowance", status: "idle" },
    { step: 3, text: "Supplying to curator", status: "idle" },
    { step: 4, text: "Waiting for transaction confirmation", status: "idle" },
    { step: 5, text: "Finalizing", status: "idle" },
  ];

  const [steps, setSteps] = useState<Step[]>(stepTemplates);
  const [txHash, setTxHash] = useState<HexAddress | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      tokenAddress,
      amount,
      decimals,
      chainId,
    }: {
      tokenAddress: HexAddress;
      amount: number;
      decimals: number;
      chainId: ChainSupported;
    }) => {
      try {
        setSteps(stepTemplates.map((s) => ({ ...s, status: "idle" })));

        if (!userAddress) throw new Error("Invalid parameters");

        if (currentChainId !== chainId) {
          await switchChainAsync({ chainId });
        }

        const denormalizedAmount = denormalize(amount, decimals);

        setSteps((prev) =>
          prev.map((step) =>
            step.step === 1 ? { ...step, status: "loading" } : step,
          ),
        );

        const allowance = await readContract(config, {
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "allowance",
          args: [userAddress, curatorAddress],
          chainId,
        });

        setSteps((prev) =>
          prev.map((step) =>
            step.step === 1
              ? { ...step, status: "success" }
              : step.step === 2
                ? { ...step, status: "loading" }
                : step,
          ),
        );

        if (Number(allowance) <= Number(denormalizedAmount)) {
          const approveTxHash = await writeContract(config, {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [curatorAddress, valueToBigInt(denormalizedAmount)],
            chainId,
          });

          const receipt = await waitForTransactionReceipt(config, {
            hash: approveTxHash,
            chainId,
          });

          if (!receipt.status) {
            throw new Error("Transaction failed");
          }

          setSteps((prev) =>
            prev.map((step) =>
              step.step === 2
                ? { ...step, status: "success" }
                : step.step === 3
                  ? { ...step, status: "loading" }
                  : step,
            ),
          );
        } else {
          setSteps((prev) =>
            prev.map((step) =>
              step.step === 2
                ? { ...step, status: "success" }
                : step.step === 3
                  ? { ...step, status: "loading" }
                  : step,
            ),
          );
        }

        if (!curatorAddress) {
          setSteps((prev) =>
            prev.map((step) =>
              step.step === 3
                ? {
                    ...step,
                    status: "error",
                    error: "Invalid args",
                  }
                : step,
            ),
          );
          throw new Error("Invalid args");
        }

        const txHash = await writeContract(config, {
          address: curatorAddress,
          abi: curatorABI,
          functionName: "deposit",
          args: [valueToBigInt(denormalizedAmount), userAddress],
          chainId,
        });

        setSteps((prev) =>
          prev.map((step) =>
            step.step === 3
              ? { ...step, status: "success" }
              : step.step === 4
                ? { ...step, status: "loading" }
                : step,
          ),
        );

        const result = await waitForTransactionReceipt(config, {
          hash: txHash,
          chainId,
        });

        setTxHash(txHash);

        setSteps((prev) =>
          prev.map((step) =>
            step.step === 4
              ? { ...step, status: "success" }
              : step.step === 5
                ? { ...step, status: "loading" }
                : step,
          ),
        );

        await new Promise((r) => setTimeout(r, 1000));
        setSteps((prev) =>
          prev.map((step) =>
            step.step === 5 ? { ...step, status: "success" } : step,
          ),
        );

        return result;
      } catch (e) {
        setSteps((prev) =>
          prev.map((step) =>
            step.status === "loading"
              ? { ...step, status: "error", error: (e as Error).message }
              : step,
          ),
        );
        throw e;
      }
    },
  });

  const loadingStates = steps.map((step) => ({
    text:
      step.status === "error"
        ? `❌ ${step.text}: ${step.error}`
        : step.status === "success"
          ? `${step.text}`
          : step.text,
  }));

  const currentStepIndex =
    steps.findIndex((s) => s.status === "loading" || s.status === "idle") === -1
      ? steps.length - 1
      : steps.findIndex((s) => s.status === "loading" || s.status === "idle");

  return { steps, mutation, txHash, loadingStates, currentStepIndex };
};
