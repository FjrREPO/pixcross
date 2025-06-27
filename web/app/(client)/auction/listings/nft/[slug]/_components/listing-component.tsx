"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  ExternalLink,
  ArrowLeft,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuctionStartedType } from "@/types/graphql/auction-starteds.type";
import { formatCompactNumber } from "@/lib/helper/number";
import { normalize } from "@/lib/helper/bignumber";
import { useNFTMetadataByAddress } from "@/hooks/query/api/use-nft-metadata-by-address";
import { urlExplorer } from "@/lib/helper/helper";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { useBidAuction } from "@/hooks/mutation/contract/auction/use-bid-auction";
import DialogTransaction from "@/components/dialog/dialog-transaction";
import { MultiStepLoader } from "@/components/loader/multi-step-loader";
import { useBalanceUser } from "@/hooks/query/contract/erc20/use-balance-user";
import TableBidsListing from "@/components/table/auction/listing/table-bids-listing";
import { useAuctionBidsByPoolIdAndTokenId } from "@/hooks/query/graphql/use-auction-bids-by-pool-id-and-token-id";
import { TokenSymbol } from "@/components/token/token-symbol";
import WalletWrapper from "@/components/wallet/wallet-wrapper";
import { useAuctionStarteds } from "@/hooks/query/graphql/use-auction-starteds";

interface ListingComponentProps {
  chainId: ChainSupported;
  contractAddress: string;
  tokenId: string;
}

interface TimeInfo {
  text: string;
  isExpired: boolean;
  totalSeconds: number;
}

interface BidFormData {
  amount: string;
  isValid: boolean;
}

const TIME_CONSTANTS = {
  DAY_MS: 24 * 60 * 60 * 1000,
  HOUR_MS: 60 * 60 * 1000,
  MINUTE_MS: 60 * 1000,
} as const;

const formatTokenAddress = (address: string): string =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const formatTimeLeft = (endTime: string): TimeInfo => {
  const end = new Date(parseInt(endTime) * 1000);
  const now = new Date();
  const timeLeft = end.getTime() - now.getTime();
  const totalSeconds = Math.floor(timeLeft / 1000);

  if (timeLeft <= 0) {
    return { text: "Expired", isExpired: true, totalSeconds: 0 };
  }

  const days = Math.floor(timeLeft / TIME_CONSTANTS.DAY_MS);
  const hours = Math.floor(
    (timeLeft % TIME_CONSTANTS.DAY_MS) / TIME_CONSTANTS.HOUR_MS,
  );
  const minutes = Math.floor(
    (timeLeft % TIME_CONSTANTS.HOUR_MS) / TIME_CONSTANTS.MINUTE_MS,
  );

  if (days > 0)
    return {
      text: `${days}d ${hours}h ${minutes}m`,
      isExpired: false,
      totalSeconds,
    };
  if (hours > 0)
    return { text: `${hours}h ${minutes}m`, isExpired: false, totalSeconds };

  return { text: `${minutes}m`, isExpired: false, totalSeconds };
};

// const formatDateTime = (timestamp: string): string => {
//   const date = new Date(parseInt(timestamp) * 1000);

//   return date.toLocaleString();
// };

const getBadgeVariant = (isExpired: boolean, isEndingSoon: boolean) => {
  if (isExpired) return "outline";
  if (isEndingSoon) return "destructive";

  return "default";
};

function AuctionHeader({
  auction,
  nftMetadata,
  timeInfo,
}: {
  auction: AuctionStartedType;
  nftMetadata: any;
  timeInfo: TimeInfo;
}) {
  const isEndingSoon = timeInfo.totalSeconds < TIME_CONSTANTS.DAY_MS / 1000;

  return (
    <div className="mb-6">
      <Link
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        href="/auction/listings"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listings
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {nftMetadata?.contract.name || "NFT"} #{auction.tokenId}
          </h1>
          <p className="text-muted-foreground">
            {nftMetadata?.description || "No description available"}
          </p>
        </div>

        <Badge
          className="text-sm px-3 py-1 w-fit"
          variant={getBadgeVariant(timeInfo.isExpired, isEndingSoon)}
        >
          {timeInfo.isExpired
            ? "Expired"
            : isEndingSoon
              ? "Ending Soon"
              : "Active"}
        </Badge>
      </div>
    </div>
  );
}

function AuctionImage({
  nftMetadata,
  auction,
  explorerUrl = "",
}: {
  nftMetadata: any;
  auction: AuctionStartedType;
  explorerUrl?: string;
}) {
  return (
    <Card>
      <CardContent>
        <div className="aspect-square bg-muted/30 rounded-lg overflow-hidden">
          <Image
            alt={nftMetadata?.name || "NFT Image"}
            className="w-full h-full object-cover"
            height={600}
            loading="lazy"
            src={nftMetadata?.image.cachedUrl || "/placeholder.jpg"}
            width={600}
          />
        </div>
        <Separator className="my-5" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Owner</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono">
              {formatTokenAddress(auction.owner)}
            </span>
            <Button asChild size="sm" variant="outline">
              <a href={explorerUrl} rel="noopener noreferrer" target="_blank">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="space-y-2">
          <span className="font-medium">Contract Details</span>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract:</span>
              <span className="font-mono">
                {formatTokenAddress(auction.collateralToken)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token ID:</span>
              <span className="font-mono">#{auction.tokenId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chain ID:</span>
              <span>{auction.chainId}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// function AuctionDetails({
//   auction,
//   timeInfo,
// }: {
//   auction: AuctionStartedType;
//   timeInfo: TimeInfo;
// }) {
//   const formattedDebt = formatCompactNumber(normalize(auction.debtAmount, 18));

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Gavel className="w-5 h-5" />
//           Auction Details
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="space-y-2">
//           <Label className="text-sm font-medium">Current Debt Amount</Label>
//           <div className="flex items-center gap-2">
//             <TokenImageCustom
//               address={auction.loanToken as HexAddress}
//               className="w-6 h-6"
//             />
//             <span className="text-2xl font-bold">{formattedDebt}</span>
//           </div>
//         </div>

//         <Separator />

//         <div className="space-y-4">
//           <div className="flex items-center gap-2">
//             <Clock className="w-4 h-4 text-muted-foreground" />
//             <span className="font-medium">Time Remaining</span>
//           </div>
//           <div
//             className={cn(
//               "text-xl font-bold",
//               timeInfo.isExpired ? "text-muted-foreground" : "text-foreground",
//             )}
//           >
//             {timeInfo.isExpired ? "Auction Ended" : timeInfo.text}
//           </div>
//         </div>

//         <Separator />

//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-muted-foreground">Started</span>
//             <span className="text-sm">{formatDateTime(auction.startTime)}</span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-muted-foreground">Ends</span>
//             <span className="text-sm">{formatDateTime(auction.endTime)}</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

function BidSection({
  auction,
  timeInfo,
  refetch,
}: {
  auction: AuctionStartedType;
  timeInfo: TimeInfo;
  refetch: () => void;
}) {
  const [showDialog, setShowDialog] = useState(false);

  const { mutation, currentStepIndex, loadingStates, txHash } = useBidAuction();

  const { data } = useAuctionBidsByPoolIdAndTokenId({
    poolId: auction.internal_id,
    tokenId: Number(auction.tokenId),
  });

  const { bNormalized } = useBalanceUser({
    token: auction.loanToken as HexAddress,
    chainId: auction.chainId as ChainSupported,
    decimals: 18,
  });

  const [bidData, setBidData] = useState<BidFormData>({
    amount: "",
    isValid: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const lastBid = normalize(data?.[0]?.amount || "0", 18);
  const currentBid = parseFloat(normalize(auction.debtAmount, 18));

  const minBid =
    lastBid && parseFloat(lastBid) > currentBid
      ? parseFloat(lastBid) + 1
      : currentBid + 1;
  const formattedMinBid = formatCompactNumber(minBid);

  const maxBid = parseFloat(
    typeof bNormalized === "number"
      ? bNormalized.toString()
      : bNormalized || "0",
  );

  const handleBidChange = (value: string) => {
    const numValue = parseFloat(value);

    setBidData({
      amount: value,
      isValid: !isNaN(numValue) && numValue >= minBid,
    });
  };

  const handleSubmitBid = () => {
    if (!bidData.isValid) return;

    mutation.mutate(
      {
        id: auction.internal_id,
        amount: bidData.amount,
        loanAddress: auction.loanToken as HexAddress,
        tokenId: auction.tokenId,
        decimals: 18,
        chainId: auction.chainId as ChainSupported,
      },
      {
        onSuccess: () => {
          setShowDialog(true);
          refetch();
          setBidData({ amount: "", isValid: false });
          inputRef.current?.blur();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
      },
    );
  };

  useEffect(() => {
    if (!timeInfo.isExpired) {
      inputRef.current?.focus();
    }
  }, [timeInfo]);

  if (timeInfo.isExpired) {
    return (
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="font-semibold text-lg">Auction Ended</h3>
          <p className="text-muted-foreground">
            This auction has ended and is no longer accepting bids.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <DialogTransaction
        chainId={auction?.chainId as ChainSupported}
        isOpen={showDialog}
        processName="Bid"
        txHash={(txHash as HexAddress) || ""}
        onClose={() => setShowDialog(false)}
      />

      <MultiStepLoader
        loading={mutation.isPending}
        loadingStates={loadingStates}
        loop={false}
        value={currentStepIndex}
      />

      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <DollarSign className="w-5 h-5 text-primary" />
          Place Your Bid
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium" htmlFor="bidAmount">
              Bid Amount
            </Label>

            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground text-right">
                Balance: {formatCompactNumber(bNormalized)}
              </p>

              <button
                className="text-xs text-primary hover:underline"
                type="button"
                onClick={() => handleBidChange(maxBid.toString())}
              >
                MAX
              </button>
            </div>
          </div>

          <div className="relative">
            <Input
              ref={inputRef}
              className={`pr-20 py-8 bg-transparent text-2xl font-semibold outline-none placeholder:text-muted-foreground/50 w-full ${
                bidData.amount && !bidData.isValid ? "border-destructive" : ""
              }`}
              id="bidAmount"
              inputMode="decimal"
              placeholder={`≥ ${formattedMinBid}`}
              type="number"
              value={bidData.amount}
              onChange={(e) => handleBidChange(e.target.value)}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <TokenImageCustom
                address={auction.loanToken as HexAddress}
                className="w-8 h-8"
              />
            </div>
          </div>

          {bidData.amount && !bidData.isValid && (
            <div className="flex items-center gap-1">
              <p className="text-sm text-destructive animate-pulse">
                Your bid must be at least {minBid}
              </p>
              <TokenSymbol
                address={auction.loanToken as HexAddress}
                className="text-sm text-destructive animate-pulse"
              />
            </div>
          )}
        </div>

        <Button
          className="w-full transition-all duration-200"
          disabled={!bidData.isValid}
          size="lg"
          onClick={handleSubmitBid}
        >
          {bidData.isValid ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Place Bid
            </>
          ) : (
            "Enter Valid Bid Amount"
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>Gas fees will apply upon transaction confirmation</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CountdownTimer({ timeInfo }: { timeInfo: TimeInfo }) {
  const [currentTime, setCurrentTime] = useState(timeInfo);

  useEffect(() => {
    if (timeInfo.isExpired) return;

    const interval = setInterval(() => {
      setCurrentTime(
        formatTimeLeft(
          String(Math.floor(Date.now() / 1000) + timeInfo.totalSeconds),
        ),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [timeInfo.isExpired, timeInfo.totalSeconds]);

  if (currentTime.isExpired) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-4">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <div className="text-center">
            <div className="text-2xl font-bold font-mono">
              {currentTime.text}
            </div>
            <div className="text-sm text-muted-foreground">Time Remaining</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ListingComponent({
  chainId,
  contractAddress,
  tokenId,
}: ListingComponentProps) {
  const { data: auctions, refetch } = useAuctionStarteds();

  const auction = auctions?.find(
    (a) =>
      a.collateralToken.toLowerCase() === contractAddress.toLowerCase() &&
      a.tokenId === tokenId &&
      a.chainId === chainId,
  );

  const { data: nftMetadata } = useNFTMetadataByAddress({
    contractAddress: contractAddress,
    chainId: chainId,
  });

  if (!auction) {
    return (
      <div className="pt-30 pb-20 max-w-7xl mx-auto px-5 sm:px-10">
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="font-semibold">Auction Not Found</h3>
            <p className="text-sm text-muted-foreground">
              The requested auction could not be found or may have been removed.
            </p>
            <Link href="/auction/listings">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Listings
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const timeInfo = formatTimeLeft(auction.endTime);
  const explorerUrl = urlExplorer({
    chainId: chainId,
    address: contractAddress,
  });

  return (
    <WalletWrapper>
      <div className="pt-30 pb-20 max-w-7xl mx-auto px-5 sm:px-10">
        <AuctionHeader
          auction={auction}
          nftMetadata={nftMetadata}
          timeInfo={timeInfo}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <AuctionImage
              auction={auction}
              explorerUrl={explorerUrl}
              nftMetadata={nftMetadata}
            />

            {/* <AuctionDetails auction={auction} timeInfo={timeInfo} /> */}
          </div>

          <div className="space-y-6">
            <CountdownTimer timeInfo={timeInfo} />

            <BidSection
              auction={auction}
              refetch={refetch}
              timeInfo={timeInfo}
            />

            <TableBidsListing
              poolId={auction.internal_id}
              tokenId={Number(tokenId)}
            />
          </div>
        </div>
      </div>
    </WalletWrapper>
  );
}
