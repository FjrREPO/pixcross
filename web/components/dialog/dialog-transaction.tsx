import React, { useState } from "react";
import { Copy, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { Log } from "viem";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { urlExplorer } from "@/lib/helper/helper";
import {
  DecodedLogs,
  useCuratorEventLog,
} from "@/hooks/decode/use-curator-event-log";

interface DialogTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: HexAddress;
  processName: string;
  logs?: Log;
  chainId: ChainSupported;
  enabledLogs?: boolean;
}

const COPY_TIMEOUT = 2000;

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(identifier);
      setTimeout(() => setCopied(null), COPY_TIMEOUT);
    } catch (error) {
      throw new Error("Failed to copy text to clipboard", error as Error);
    }
  };

  return { copied, copyText };
};

const truncateAddress = (address: string, startLength = 6, endLength = 4) => {
  if (address.length <= startLength + endLength) return address;

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

const TransactionHashSection: React.FC<{
  txHash: string;
  copied: string | null;
  onCopy: () => void;
  onOpenExplorer: () => void;
}> = ({ txHash, copied, onCopy, onOpenExplorer }) => (
  <div className="max-w-md rounded-lg p-4 space-y-3 border border-gray-300">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold">Transaction Hash</h3>
      <Badge className="text-xs" variant="secondary">
        Confirmed
      </Badge>
    </div>

    <div className="space-y-2">
      {/* Desktop view */}
      <div className="hidden sm:flex items-center gap-2">
        <code className="flex-1 font-mono text-xs p-3 rounded-md border overflow-x-auto select-all">
          {txHash}
        </code>
        <div className="flex gap-1">
          <Button
            aria-label={
              copied === "tx"
                ? "Transaction hash copied!"
                : "Copy transaction hash"
            }
            className="shrink-0 transition-all duration-200 hover:bg-gray-100 hover:scale-105"
            size="sm"
            variant="ghost"
            onClick={onCopy}
          >
            {copied === "tx" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-gray-500" />
            )}
          </Button>
          <Button
            aria-label="View transaction in blockchain explorer"
            className="shrink-0 transition-all duration-200 hover:bg-gray-100 hover:scale-105"
            size="sm"
            variant="ghost"
            onClick={onOpenExplorer}
          >
            <ExternalLink className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>

      <div className="sm:hidden space-y-2">
        <code className="block font-mono text-xs p-3 rounded-md border break-all select-all">
          {truncateAddress(txHash, 8, 8)}
        </code>
        <div className="flex gap-2 justify-center">
          <Button
            aria-label={copied === "tx" ? "Copied!" : "Copy hash"}
            className="flex-1 transition-all duration-200"
            size="sm"
            variant={copied === "tx" ? "default" : "outline"}
            onClick={onCopy}
          >
            {copied === "tx" ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
          <Button
            aria-label="View in explorer"
            className="flex-1 transition-all duration-200"
            size="sm"
            variant="outline"
            onClick={onOpenExplorer}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Explorer
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const CuratorAddressSection: React.FC<{
  decodedLogs: DecodedLogs | null;
  decodeError: string | null;
  copied: string | null;
  onCopy: () => void;
  onOpenExplorer: () => void;
}> = ({ decodedLogs, decodeError, copied, onCopy, onOpenExplorer }) => (
  <div className="max-w-md rounded-lg p-4 space-y-3 border border-gray-300">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold">Curator Address</h3>
      {decodedLogs?.args.curator && (
        <Badge
          className="text-xs border-orange-400 text-orange-400"
          variant="outline"
        >
          Active
        </Badge>
      )}
    </div>

    <div className="space-y-2">
      {decodeError ? (
        <div className="flex items-center gap-2 p-3 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-500">{decodeError}</p>
        </div>
      ) : decodedLogs?.args.curator ? (
        <>
          <div className="hidden sm:flex items-center gap-2">
            <code className="flex-1 font-mono text-xs p-3 rounded-md border overflow-x-auto select-all">
              {decodedLogs.args.curator}
            </code>
            <div className="flex gap-1">
              <Button
                aria-label={
                  copied === "curator"
                    ? "Curator address copied!"
                    : "Copy curator address"
                }
                className="shrink-0 transition-all duration-200 hover:bg-blue-100 hover:scale-105"
                size="sm"
                variant="ghost"
                onClick={onCopy}
              >
                {copied === "curator" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-orange-400" />
                )}
              </Button>
              <Button
                aria-label="View curator address in blockchain explorer"
                className="shrink-0 transition-all duration-200 hover:bg-orange-100 hover:scale-105"
                size="sm"
                variant="ghost"
                onClick={onOpenExplorer}
              >
                <ExternalLink className="h-4 w-4 text-orange-400" />
              </Button>
            </div>
          </div>

          {/* Mobile view */}
          <div className="sm:hidden space-y-2">
            <code className="block font-mono text-xs p-3 rounded-md border break-all select-all">
              {truncateAddress(decodedLogs.args.curator, 8, 8)}
            </code>
            <div className="flex gap-2 justify-center">
              <Button
                aria-label={copied === "curator" ? "Copied!" : "Copy address"}
                className="flex-1 transition-all duration-200"
                size="sm"
                variant={copied === "curator" ? "default" : "outline"}
                onClick={onCopy}
              >
                {copied === "curator" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                aria-label="View curator in explorer"
                className="flex-1 transition-all duration-200"
                size="sm"
                variant="outline"
                onClick={onOpenExplorer}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Explorer
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-gray-500 shrink-0" />
          <p className="text-sm text-gray-600">No curator logs available</p>
        </div>
      )}
    </div>
  </div>
);

export const DialogTransaction: React.FC<DialogTransactionProps> = ({
  isOpen,
  onClose,
  txHash,
  processName,
  logs,
  chainId,
  enabledLogs = false,
}) => {
  const { copied, copyText } = useCopyToClipboard();
  const { decodedLogs, decodeError, chainIdFromLogs } = useCuratorEventLog(
    logs,
    enabledLogs,
  );

  const effectiveChainId = chainIdFromLogs || chainId;

  const handleCopyTxHash = () => copyText(txHash, "tx");

  const handleCopyCurator = () => {
    if (decodedLogs?.args.curator) {
      copyText(decodedLogs.args.curator, "curator");
    }
  };

  const openTxExplorer = () => {
    window.open(
      urlExplorer({ chainId: effectiveChainId, txHash }),
      "_blank",
      "noopener noreferrer",
    );
  };

  const openCuratorExplorer = () => {
    if (decodedLogs?.args.curator) {
      window.open(
        urlExplorer({
          chainId: effectiveChainId,
          address: decodedLogs.args.curator,
        }),
        "_blank",
        "noopener noreferrer",
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="transaction-success-description"
        className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto bg-background/90"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="text-center space-y-4 pb-2">
          <div className="space-y-2">
            <DialogTitle className="text-xl font-semibold">
              Transaction Successful!
            </DialogTitle>
            <p
              className="text-sm text-foreground/80 mx-auto leading-relaxed"
              id="transaction-success-description"
            >
              Your <span className="font-medium">{processName}</span> has been
              successfully completed and confirmed on the blockchain.
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Separator />

          <TransactionHashSection
            copied={copied}
            txHash={txHash}
            onCopy={handleCopyTxHash}
            onOpenExplorer={openTxExplorer}
          />

          {enabledLogs && (
            <CuratorAddressSection
              copied={copied}
              decodeError={decodeError}
              decodedLogs={decodedLogs}
              onCopy={handleCopyCurator}
              onOpenExplorer={openCuratorExplorer}
            />
          )}

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              className="flex-1 transition-all duration-200 hover:scale-105"
              variant="default"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className="flex-1 transition-all duration-200 hover:scale-105"
              variant="outline"
              onClick={openTxExplorer}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Transaction
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTransaction;
