import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";
import { erc20Abi, parseUnits } from "viem";

import { config } from "@/lib/wagmi";
import { valueToBigInt } from "@/lib/helper/bignumber";
import { contractAddresses } from "@/lib/constants";
import { pixcrossBridgeERC20ABI } from "@/lib/abis/pixcross-bridge-erc20.abi";
import { chainSelectorId, PayFeesIn } from "@/types/contract/bridge.type";
import { useBridgeQuoteERC20 } from "@/hooks/query/contract/bridge/use-bridge-quote-erc20";

type Status = "idle" | "loading" | "success" | "error";
type HexAddress = `0x${string}`;

type Step = {
  step: number;
  text: string;
  status: Status;
  error?: string;
};

export const useBridgeERC20 = () => {
  const { address: userAddress } = useAccount();
  const currentChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const stepTemplates: Step[] = [
    { step: 1, text: "Preparing transaction", status: "idle" },
    { step: 2, text: "Checking token allowance", status: "idle" },
    { step: 3, text: "Bridging token", status: "idle" },
    { step: 4, text: "Waiting for transaction confirmation", status: "idle" },
    { step: 5, text: "Finalizing", status: "idle" },
  ];

  const [steps, setSteps] = useState<Step[]>(stepTemplates);
  const [txHash, setTxHash] = useState<HexAddress | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      tokenAddress,
      receiver,
      destChainId,
      payFeesIn = PayFeesIn.Native,
      amount,
      decimals,
      quote,
      chainId,
    }: {
      tokenAddress: HexAddress;
      receiver: HexAddress;
      destChainId: ChainSupported;
      payFeesIn?: PayFeesIn;
      amount: string;
      decimals: number;
      quote: ReturnType<typeof useBridgeQuoteERC20>["data"];
      chainId: ChainSupported;
    }) => {
      try {
        setSteps(stepTemplates.map((s) => ({ ...s, status: "idle" })));

        const pixcrossBridgeERC20Address = contractAddresses[chainId]
          .pixcrossBridgeERC20 as HexAddress;

        const amountInWei = parseUnits(amount, decimals);

        const chainIdSelector = chainSelectorId[destChainId];

        if (currentChainId !== chainId) {
          await switchChainAsync({ chainId });
        }

        setSteps((prev) =>
          prev.map((step) =>
            step.step === 1 ? { ...step, status: "loading" } : step,
          ),
        );

        const allowance = await readContract(config, {
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "allowance",
          args: [userAddress as HexAddress, pixcrossBridgeERC20Address],
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

        if (Number(allowance) < Number(amountInWei)) {
          const approveTxHash = await writeContract(config, {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [pixcrossBridgeERC20Address, amountInWei],
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

        const tokenId =
          tokenAddress === contractAddresses[chainId].usdt
            ? 1
            : tokenAddress === contractAddresses[chainId].usdc
              ? 0
              : 2;

        const txHash = await writeContract(config, {
          address: pixcrossBridgeERC20Address,
          abi: pixcrossBridgeERC20ABI,
          functionName: "bridgeTokens",
          args: [
            BigInt(chainIdSelector),
            receiver,
            BigInt(tokenId),
            amountInWei,
            valueToBigInt(payFeesIn),
          ],
          value: quote?.totalFee,
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
