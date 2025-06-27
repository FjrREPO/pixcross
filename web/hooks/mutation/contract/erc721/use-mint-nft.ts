import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";

import { config } from "@/lib/wagmi";
import { IPAbi } from "@/lib/abis/ip.abi";

type Status = "idle" | "loading" | "success" | "error";
type HexAddress = `0x${string}`;

type Step = {
  step: number;
  text: string;
  status: Status;
  error?: string;
};

export const useMintNFT = () => {
  const { address: userAddress } = useAccount();
  const currentChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const stepTemplates: Step[] = [
    { step: 1, text: "Preparing mint transaction", status: "idle" },
    { step: 2, text: "Waiting for transaction confirmation", status: "idle" },
    { step: 3, text: "Finalizing", status: "idle" },
  ];

  const [steps, setSteps] = useState<Step[]>(stepTemplates);
  const [txHash, setTxHash] = useState<HexAddress | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      chainId,
      nftAddress,
    }: {
      chainId: ChainSupported;
      nftAddress: HexAddress;
    }) => {
      try {
        setSteps(stepTemplates.map((s) => ({ ...s, status: "idle" })));

        if (!nftAddress || !userAddress) throw new Error("Invalid parameters");

        if (currentChainId !== chainId) {
          await switchChainAsync({ chainId });
        }

        setSteps((prev) =>
          prev.map((step) =>
            step.step === 1 ? { ...step, status: "loading" } : step,
          ),
        );

        const txHash = await writeContract(config, {
          address: nftAddress,
          abi: IPAbi,
          functionName: "publicMint",
          args: [userAddress],
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

        const result = await waitForTransactionReceipt(config, {
          hash: txHash,
        });

        setTxHash(txHash);

        setSteps((prev) =>
          prev.map((step) =>
            step.step === 2
              ? { ...step, status: "success" }
              : step.step === 3
                ? { ...step, status: "loading" }
                : step,
          ),
        );

        await new Promise((r) => setTimeout(r, 1000));
        setSteps((prev) =>
          prev.map((step) =>
            step.step === 3 ? { ...step, status: "success" } : step,
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
