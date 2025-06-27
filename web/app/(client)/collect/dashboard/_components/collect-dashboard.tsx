"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Calendar,
  Hash,
  Image as ImageIcon,
  RefreshCw,
  Grid3X3,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  MoreHorizontal,
  ChevronDown,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useOwnerNFTMultichain } from "@/hooks/query/api/use-owner-nft-multichain";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chainMetaMap } from "@/data/chains.data";
import { NFTMetadataType } from "@/types/api/nft-metadata.type";

// Constants for pagination
const ITEMS_PER_PAGE_OPTIONS = [8, 12, 24];
const DEFAULT_ITEMS_PER_PAGE = 8;

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

// Memoized NFT Card Component
const NFTCard = React.memo(({ nft }: { nft: NFTMetadataType }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const name = nft.name || `Token #${nft.tokenId}`;
  const description = nft.description || "No description available.";
  const contractName = nft.contract.name || "Unknown Contract";
  const imageUrl = nft.image?.cachedUrl;
  const floorPrice = nft.contract.openSeaMetadata?.floorPrice;

  const handleLikeClick = useCallback(() => {
    setIsLiked((prev) => !prev);
  }, []);

  return (
    <Card
      className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card border-0 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />

      <CardContent className="relative p-0 z-10">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          {imageUrl ? (
            <div className="relative aspect-square">
              <Image
                fill
                alt={name}
                className="object-cover transition-all duration-700 group-hover:scale-110"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={imageUrl}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

              {/* Action buttons overlay */}
              <div
                className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
              >
                <Button
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 p-0"
                  size="sm"
                  variant="secondary"
                  onClick={handleLikeClick}
                >
                  <Heart
                    className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`}
                  />
                </Button>
                <Button
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 p-0"
                  size="sm"
                  variant="secondary"
                >
                  <Share2 className="w-4 h-4 text-white" />
                </Button>
                <Button
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 p-0"
                  size="sm"
                  variant="secondary"
                >
                  <MoreHorizontal className="w-4 h-4 text-white" />
                </Button>
              </div>

              {/* Price badge */}
              {floorPrice && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/20 backdrop-blur-md border-white/20 text-white font-semibold px-3 py-1.5 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" />Ξ {floorPrice}
                  </Badge>
                </div>
              )}

              {/* Chain indicator */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md border-white/20 rounded-full px-3 py-1.5">
                  {chainMetaMap[nft.chainId as keyof typeof chainMetaMap]
                    ?.icon && (
                    <Image
                      alt={
                        chainMetaMap[nft.chainId as keyof typeof chainMetaMap]
                          .name
                      }
                      className="w-4 h-4 rounded-full"
                      height={16}
                      src={
                        chainMetaMap[nft.chainId as keyof typeof chainMetaMap]
                          .icon
                      }
                      width={16}
                    />
                  )}
                  <span className="text-white text-xs font-medium">
                    {chainMetaMap[nft.chainId as keyof typeof chainMetaMap]
                      ?.name || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-8 h-8 text-primary/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  No Image Available
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Title and Collection */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
                {name}
              </h3>
              <Button
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-auto"
                size="sm"
                variant="ghost"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                className="gap-1.5 text-xs border-primary/20 text-primary/80"
                variant="outline"
              >
                <Layers className="w-3 h-3" />
                {contractName}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {description && description !== "No description available." && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Metadata */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="w-3 h-3 shrink-0 text-primary/60" />
                <span className="font-medium">ID:</span>
                <span className="font-mono text-foreground">
                  #{nft.tokenId}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-3 h-3 shrink-0 text-primary/60" />
                <span className="font-medium">Updated:</span>
                <span className="text-foreground">
                  {nft.timeLastUpdated
                    ? new Date(nft.timeLastUpdated).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

NFTCard.displayName = "NFTCard";

// Skeleton Component
function NFTCardSkeleton() {
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-card/50 to-card border-0 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardContent className="p-0">
        <div className="relative">
          <Skeleton className="aspect-square w-full rounded-t-xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center">
      <div className="relative">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center backdrop-blur-sm border border-primary/10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/80 border-4 border-background flex items-center justify-center shadow-lg">
          <ImageIcon className="w-6 h-6 text-accent-foreground" />
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Your Collection Awaits
        </h3>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Start building your NFT collection. Connect your wallet to discover
          amazing digital assets across multiple blockchains.
        </p>
      </div>

      <div className="flex gap-3">
        <Button className="gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300">
          <RefreshCw className="w-5 h-5" />
          Refresh Collection
        </Button>
        <Button
          className="gap-2 h-12 px-6 rounded-xl border-primary/20 hover:border-primary/40 hover:bg-primary/5"
          variant="outline"
        >
          <Search className="w-5 h-5" />
          Explore NFTs
        </Button>
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({
  paginationInfo,
  onPageChange,
  onItemsPerPageChange,
}: {
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}) {
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex,
  } = paginationInfo;

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-border/50">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
          {totalItems} NFTs
        </span>
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          className="gap-2 h-10 px-3"
          disabled={currentPage === 1}
          size="sm"
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-1">
          {getPageNumbers().map((page) => (
            <Button
              key={page}
              className="w-10 h-10 p-0"
              size="sm"
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          className="gap-2 h-10 px-3"
          disabled={currentPage === totalPages}
          size="sm"
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Main Component
export default function CollectDashboard() {
  const { data, isLoading } = useOwnerNFTMultichain();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!data) return [];

    return (data as unknown as NFTMetadataType[]).filter(
      (nft) =>
        nft.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.contract.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  // Memoized pagination info and current page data
  const { paginationInfo, currentPageData } = useMemo(() => {
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginationInfo: PaginationInfo = {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      startIndex,
      endIndex,
    };

    const currentPageData = filteredData.slice(startIndex, endIndex);

    return { paginationInfo, currentPageData };
  }, [filteredData, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-4 py-8 pt-32">
            <div className="mb-12 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-3">
                  <Skeleton className="h-10 w-80" />
                  <Skeleton className="h-5 w-60" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-32" />
                </div>
              </div>

              <div className="flex gap-4">
                <Skeleton className="h-12 flex-1 max-w-md" />
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-24" />
              </div>
            </div>

            {/* Loading grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: DEFAULT_ITEMS_PER_PAGE }).map(
                (_, index) => (
                  <NFTCardSkeleton key={index} />
                ),
              )}
            </div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <EmptyState />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8 pt-32">
            {/* Header */}
            <div className="mb-12 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                    My NFT Collection
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    <span className="font-semibold text-primary">
                      {filteredData.length}
                    </span>{" "}
                    {searchQuery ? "filtered" : "unique digital"} assets
                    <span className="mx-2">•</span>
                    <span>Across multiple blockchains</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    className="gap-2 h-12 px-4 rounded-xl"
                    size="sm"
                    variant={viewMode === "grid" ? "default" : "outline"}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    Grid
                  </Button>
                  <Button
                    className="gap-2 h-12 px-4 rounded-xl hover:bg-primary/5 border-primary/20"
                    variant="outline"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Search and filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    className="pl-12 h-12 rounded-xl border-primary/20 focus:border-primary/40 bg-card/50 backdrop-blur-sm"
                    placeholder="Search your collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Button
                  className="gap-2 h-12 px-4 rounded-xl border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                  variant="outline"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className="w-4 h-4" />
                </Button>

                <Button
                  className="gap-2 h-12 px-4 rounded-xl border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                  variant="outline"
                >
                  <Sparkles className="w-4 h-4" />
                  Sort
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {searchQuery && (
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {filteredData.length} results for &quot;{searchQuery}&quot;
                </p>
              </div>
            )}

            {/* NFT Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentPageData.map((nft: NFTMetadataType, index: number) => (
                <div
                  key={`${nft.contract.address}-${nft.tokenId}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <NFTCard nft={nft} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {paginationInfo.totalPages > 1 && (
              <Pagination
                paginationInfo={paginationInfo}
                onItemsPerPageChange={handleItemsPerPageChange}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
