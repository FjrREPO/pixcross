"use client";
import React, { useState, useMemo } from "react";
import { Clock, Search, X, ExternalLink, Hash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AuctionStartedType } from "@/types/graphql/auction-starteds.type";
import { formatCompactNumber } from "@/lib/helper/number";
import { normalize } from "@/lib/helper/bignumber";
import { useNFTMetadataByAddress } from "@/hooks/query/api/use-nft-metadata-by-address";
import { urlExplorer } from "@/lib/helper/helper";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import WalletWrapper from "@/components/wallet/wallet-wrapper";
import { useAuctionStarteds } from "@/hooks/query/graphql/use-auction-starteds";

type FilterType = "all" | "active" | "ending-soon" | "expired";
type SortType = "endTime" | "debtAmount" | "startTime";

interface AuctionCardProps {
  auction: AuctionStartedType;
}

interface TimeInfo {
  text: string;
  isExpired: boolean;
}

interface AuctionStatus {
  type: FilterType;
  label: string;
}

interface FilterCounts {
  all: number;
  active: number;
  "ending-soon": number;
  expired: number;
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

  if (timeLeft <= 0) {
    return { text: "Expired", isExpired: true };
  }

  const days = Math.floor(timeLeft / TIME_CONSTANTS.DAY_MS);
  const hours = Math.floor(
    (timeLeft % TIME_CONSTANTS.DAY_MS) / TIME_CONSTANTS.HOUR_MS,
  );
  const minutes = Math.floor(
    (timeLeft % TIME_CONSTANTS.HOUR_MS) / TIME_CONSTANTS.MINUTE_MS,
  );

  if (days > 0) return { text: `${days}d ${hours}h`, isExpired: false };
  if (hours > 0) return { text: `${hours}h ${minutes}m`, isExpired: false };

  return { text: `${minutes}m`, isExpired: false };
};

const getAuctionStatus = (auction: AuctionStartedType): AuctionStatus => {
  const timeInfo = formatTimeLeft(auction.endTime);
  const endTime = new Date(parseInt(auction.endTime) * 1000);
  const timeLeft = endTime.getTime() - Date.now();

  if (timeInfo.isExpired) {
    return { type: "expired", label: "Expired" };
  }

  if (timeLeft < TIME_CONSTANTS.DAY_MS) {
    return { type: "ending-soon", label: "Ending Soon" };
  }

  return { type: "active", label: "Active" };
};

const getBadgeVariant = (statusType: FilterType) => {
  switch (statusType) {
    case "expired":
      return "outline";
    case "ending-soon":
      return "destructive";
    default:
      return "default";
  }
};

function AuctionCard({ auction }: AuctionCardProps) {
  const timeInfo = formatTimeLeft(auction.endTime);
  const status = getAuctionStatus(auction);
  const formattedDebt = formatCompactNumber(normalize(auction.debtAmount, 18));

  const { data: nftMetadata } = useNFTMetadataByAddress({
    contractAddress: auction.collateralToken,
    chainId: auction.chainId as ChainSupported,
  });

  const auctionUrl = `/auction/listings/nft/${auction.collateralToken}_${auction.tokenId}_${auction.chainId}`;
  const explorerUrl = urlExplorer({
    chainId: auction.chainId as ChainSupported,
    address: auction.collateralToken,
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg">
              {nftMetadata?.contract.name} #{auction.tokenId}
            </CardTitle>
            <div className="flex items-center gap-2">
              <TokenImageCustom
                address={auction.loanToken as HexAddress}
                className="w-5 h-5"
              />
              <p className="text-sm text-muted-foreground">{formattedDebt}</p>
            </div>
          </div>
          <Badge className="text-xs" variant={getBadgeVariant(status.type)}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
          <Image
            alt={nftMetadata?.name || "NFT Image"}
            className="rounded-lg"
            height={400}
            loading="lazy"
            src={nftMetadata?.image.cachedUrl || "/placeholder.jpg"}
            width={400}
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span
            className={cn(
              timeInfo.isExpired ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {timeInfo.isExpired ? "Auction ended" : `${timeInfo.text} left`}
          </span>
        </div>

        <div className="text-xs text-muted-foreground">
          Owner: {formatTokenAddress(auction.owner)}
        </div>

        <div className="flex gap-2">
          <Link className="flex-1" href={auctionUrl}>
            <Button
              className="w-full"
              disabled={timeInfo.isExpired}
              size="sm"
              variant={timeInfo.isExpired ? "outline" : "default"}
            >
              {timeInfo.isExpired ? "View Details" : "View Details"}
            </Button>
          </Link>
          <Button asChild className="px-3" size="sm" variant="outline">
            <a href={explorerUrl} rel="noopener noreferrer" target="_blank">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SearchInput({
  searchTerm,
  onSearchChange,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="pl-10"
        placeholder="Search by token ID or owner..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <Button
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          size="sm"
          variant="ghost"
          onClick={() => onSearchChange("")}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

function FilterButtons({
  filter,
  filterCounts,
  onFilterChange,
}: {
  filter: FilterType;
  filterCounts: FilterCounts;
  onFilterChange: (filter: FilterType) => void;
}) {
  const formatFilterLabel = (filterType: FilterType): string => {
    return (
      filterType.charAt(0).toUpperCase() + filterType.slice(1).replace("-", " ")
    );
  };

  return (
    <div className="flex flex-wrap gap-3">
      {(Object.keys(filterCounts) as FilterType[]).map((filterType) => (
        <Button
          key={filterType}
          size="sm"
          variant={filter === filterType ? "default" : "outline"}
          onClick={() => onFilterChange(filterType)}
        >
          {formatFilterLabel(filterType)}
          <span className="ml-1 text-xs opacity-70">
            ({filterCounts[filterType]})
          </span>
        </Button>
      ))}
    </div>
  );
}

function SortSelect({
  sortBy,
  onSortChange,
}: {
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
}) {
  return (
    <Select value={sortBy} onValueChange={onSortChange}>
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="endTime">End Time</SelectItem>
        <SelectItem value="debtAmount">Debt Amount</SelectItem>
        <SelectItem value="startTime">Start Time</SelectItem>
      </SelectContent>
    </Select>
  );
}

function EmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <Card className="p-8 text-center">
      <div className="space-y-3">
        <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
          <Hash className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold">No auctions found</h3>
        <p className="text-sm text-muted-foreground">
          {hasFilters
            ? "Try adjusting your search or filters"
            : "No active auctions at the moment"}
        </p>
        {hasFilters && (
          <Button size="sm" variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    </Card>
  );
}

function useAuctionFiltering(auctions: AuctionStartedType[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("endTime");

  const filteredAndSortedAuctions = useMemo(() => {
    let filtered = auctions.filter((auction) => {
      const matchesSearch = [auction.tokenId, auction.id, auction.owner].some(
        (field) => field.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      if (!matchesSearch) return false;
      if (filter === "all") return true;

      const endTime = new Date(parseInt(auction.endTime) * 1000);
      const timeLeft = endTime.getTime() - Date.now();

      switch (filter) {
        case "active":
          return timeLeft > TIME_CONSTANTS.DAY_MS;
        case "ending-soon":
          return timeLeft < TIME_CONSTANTS.DAY_MS && timeLeft > 0;
        case "expired":
          return timeLeft <= 0;
        default:
          return true;
      }
    });

    filtered.sort((a, b) => {
      const getValue = (auction: AuctionStartedType): number => {
        switch (sortBy) {
          case "endTime":
            return parseInt(auction.endTime);
          case "debtAmount":
            return parseFloat(auction.debtAmount);
          case "startTime":
            return parseInt(auction.startTime);
          default:
            return parseInt(auction.endTime);
        }
      };

      return getValue(a) - getValue(b);
    });

    return filtered;
  }, [auctions, searchTerm, filter, sortBy]);

  const filterCounts = useMemo((): FilterCounts => {
    const counts: FilterCounts = {
      all: auctions.length,
      active: 0,
      "ending-soon": 0,
      expired: 0,
    };

    auctions.forEach((auction) => {
      const endTime = new Date(parseInt(auction.endTime) * 1000);
      const timeLeft = endTime.getTime() - Date.now();

      if (timeLeft <= 0) {
        counts.expired++;
      } else if (timeLeft < TIME_CONSTANTS.DAY_MS) {
        counts["ending-soon"]++;
      } else {
        counts.active++;
      }
    });

    return counts;
  }, [auctions]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilter("all");
  };

  const hasFilters = searchTerm !== "" || filter !== "all";

  return {
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    filteredAndSortedAuctions,
    filterCounts,
    clearFilters,
    hasFilters,
  };
}

export default function ListingsComponent() {
  const { data: auctions } = useAuctionStarteds();
  const displayAuctions = auctions || [];

  const {
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    filteredAndSortedAuctions,
    filterCounts,
    clearFilters,
    hasFilters,
  } = useAuctionFiltering(displayAuctions);

  return (
    <WalletWrapper>
      <div className="pt-30 pb-20 max-w-7xl mx-auto px-5 sm:px-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Auction Listings</h1>
          <p className="text-muted-foreground">
            Browse and bid on NFT auctions
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <SearchInput searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <div className="flex flex-wrap gap-3">
            <FilterButtons
              filter={filter}
              filterCounts={filterCounts}
              onFilterChange={setFilter}
            />
            <SortSelect sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedAuctions.length} auction
            {filteredAndSortedAuctions.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredAndSortedAuctions.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </div>
    </WalletWrapper>
  );
}
