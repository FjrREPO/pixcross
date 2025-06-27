"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { checksumAddress } from "viem";
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { DataTableColumnHeader } from "./column-header";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatAddress } from "@/lib/helper/helper";
import { ChainData, chainData } from "@/data/chains.data";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { normalize } from "@/lib/helper/bignumber";
import { BridgeTransactionType } from "@/types/graphql/bridge.type";
import { CCIPTransactionType } from "@/types/api/ccip-transaction.type";
import { formatCompactNumber } from "@/lib/helper/number";
import { TokenSymbol } from "@/components/token/token-symbol";

interface ColumnsProps {
  ccipData: CCIPTransactionType[];
}

export function columns(
  ccipData: ColumnsProps["ccipData"],
): ColumnDef<BridgeTransactionType>[] {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard!");
    } catch (err) {
      throw new Error("Failed to copy text: " + err);
    }
  };

  return [
    {
      accessorKey: "messageId",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          className="justify-start pl-6"
          column={column}
          title="Message ID"
        />
      ),
      cell: ({ row }: { row: { original: BridgeTransactionType } }) => {
        const messageId = row.original.messageId || "";

        return (
          <div className="flex justify-start items-center gap-3 py-4 pl-6">
            <div className="flex items-center gap-2 group">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded-md border">
                {formatAddress(messageId)}
              </code>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="h-7 w-7 p-0"
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(messageId)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy Message ID</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`https://ccip.chain.link/#/side-drawer/msg/${messageId}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Button
                        className="h-7 w-7 p-0 ml-1"
                        size="sm"
                        variant="ghost"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Transaction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "token",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          className="justify-start"
          column={column}
          title="Asset"
        />
      ),
      cell: ({ row }: { row: { original: BridgeTransactionType } }) => {
        const amount = normalize(row.original.amount || "0", 18);
        const token = checksumAddress(row.original.token as HexAddress);

        return (
          <div className="flex justify-start items-center gap-3 py-4 pl-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <TokenImageCustom
                  address={token}
                  className="min-w-8 min-h-8 w-8 h-8 rounded-full border-2 border-background shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  {formatCompactNumber(amount, 2)}
                </span>
                <span className="text-xs text-muted-foreground">
                  <TokenSymbol address={token} className="font-medium" />
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "sourceChain",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Source Chain"
        />
      ),
      cell: ({ row }: { row: { original: BridgeTransactionType } }) => {
        const findChain = chainData.find((chain: ChainData) =>
          ccipData.find(
            (ccip: CCIPTransactionType) =>
              ccip.sourceNetworkName === chain.ccipName &&
              ccip.messageId === row.original.messageId,
          ),
        );

        return (
          <div className="flex justify-center items-center py-4">
            {findChain ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
                <Image
                  alt={findChain.name}
                  className="rounded-full ring-2 ring-background"
                  height={20}
                  src={findChain.icon}
                  width={20}
                />
                <span className="text-sm font-medium text-foreground">
                  {findChain.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Unknown Chain</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "destinationChain",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Destination Chain"
        />
      ),
      cell: ({ row }: { row: { original: BridgeTransactionType } }) => {
        const findChain = chainData.find((chain: ChainData) =>
          ccipData.find(
            (ccip: CCIPTransactionType) =>
              ccip.destNetworkName === chain.ccipName &&
              ccip.messageId === row.original.messageId,
          ),
        );

        return (
          <div className="flex justify-center items-center py-4">
            {findChain ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
                <Image
                  alt={findChain.name}
                  className="rounded-full ring-2 ring-background"
                  height={20}
                  src={findChain.icon}
                  width={20}
                />
                <span className="text-sm font-medium text-foreground">
                  {findChain.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Unknown Chain</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Status"
        />
      ),
      cell: ({ row }: { row: { original: BridgeTransactionType } }) => {
        const findCCIP = ccipData.find(
          (ccip: CCIPTransactionType) =>
            ccip.messageId === row.original.messageId,
        );

        const isSuccess =
          findCCIP?.receiptTimestamp !== null &&
          findCCIP?.state !== null &&
          findCCIP?.destTransactionHash !== null;

        return (
          <div className="flex justify-center items-center py-4">
            <div className="flex items-center gap-2">
              {isSuccess ? (
                <Badge
                  className="bg-green-500/50 hover:bg-green-600 text-white px-3 py-1"
                  variant="default"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Success
                </Badge>
              ) : (
                <Badge
                  className="bg-yellow-100/50 text-yellow-800 border-yellow-200 px-3 py-1"
                  variant="secondary"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              )}
            </div>
          </div>
        );
      },
    },
  ];
}
