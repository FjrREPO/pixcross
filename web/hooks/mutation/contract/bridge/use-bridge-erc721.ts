import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";
import { erc721Abi, parseEther } from "viem";

import { config } from "@/lib/wagmi";
import { valueToBigInt } from "@/lib/helper/bignumber";
import { contractAddresses } from "@/lib/constants";
import { pixcrossBridgeERC721ABI } from "@/lib/abis/pixcross-bridge-erc721.abi";

type Status = "idle" | "loading" | "success" | "error";
type HexAddress = `0x${string}`;

type Step = {
  step: number;
  text: string;
  status: Status;
  error?: string;
};

export const useBridgeERC721 = () => {
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
      tokenId,
      // quote,
      chainId,
    }: {
      tokenAddress: HexAddress;
      receiver: HexAddress;
      destChainId: ChainSupported;
      tokenId: number;
      quote?: bigint;
      chainId: ChainSupported;
    }) => {
      try {
        setSteps(stepTemplates.map((s) => ({ ...s, status: "idle" })));

        if (!userAddress) throw new Error("Invalid parameters");

        if (currentChainId !== chainId) {
          await switchChainAsync({ chainId });
        }

        const pixcrossBridgeERC721Address = contractAddresses[chainId]
          .pixcrossBridgeERC721 as HexAddress;

        setSteps((prev) =>
          prev.map((step) =>
            step.step === 1 ? { ...step, status: "loading" } : step,
          ),
        );

        const allowance = await readContract(config, {
          address: tokenAddress,
          abi: erc721Abi,
          functionName: "isApprovedForAll",
          args: [userAddress, pixcrossBridgeERC721Address],
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

        if (allowance === false) {
          const approveTxHash = await writeContract(config, {
            address: tokenAddress,
            abi: erc721Abi,
            functionName: "setApprovalForAll",
            args: [pixcrossBridgeERC721Address, true],
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

        const txHash = await writeContract(config, {
          address: pixcrossBridgeERC721Address,
          abi: pixcrossBridgeERC721ABI,
          functionName: "bridgeToken",
          args: [
            tokenAddress,
            valueToBigInt(tokenId),
            valueToBigInt(destChainId),
            receiver,
            false,
          ],
          value: parseEther("0.0001"),
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
