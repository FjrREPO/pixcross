import { useState } from "react";
import { Search, Grid3X3, List, Filter } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { NFTSchemaType } from "@/types/api/nft.type";
import { chainMetaMap } from "@/data/chains.data";

interface NFTSelectionDialogProps {
  children: React.ReactNode;
  ownerNfts?: NFTSchemaType[];
  selectedNFT?: NFTSchemaType;
  onSelectNFT: (nft: NFTSchemaType) => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function NFTSelectionDialog({
  children,
  ownerNfts = [],
  selectedNFT,
  onSelectNFT,
  title = "Select NFT",
  description = "Choose an NFT from your collection",
  isLoading = false,
}: NFTSelectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<"ALL" | "IP">("ALL");
  const [sortBy, setSortBy] = useState<"name">("name");

  const handleSelectNFT = (nft: NFTSchemaType) => {
    onSelectNFT(nft);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="px-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={filterType}
              onValueChange={(value: any) => setFilterType(value)}
            >
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="IP">IP NFTs</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 px-6 pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Loading NFTs...</span>
              </div>
            </div>
          ) : (
            <Tabs className="w-full h-full" defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All ({ownerNfts.length})</TabsTrigger>
                <TabsTrigger value="ip">
                  IP NFTs ({ownerNfts.length})
                </TabsTrigger>
                <TabsTrigger value="collateral">
                  Collateral ({ownerNfts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent className="mt-4" value="all">
                <NFTGrid
                  nfts={ownerNfts}
                  selectedNFT={selectedNFT}
                  viewMode={viewMode}
                  onSelectNFT={handleSelectNFT}
                />
              </TabsContent>

              <TabsContent className="mt-4" value="ip">
                <NFTGrid
                  nfts={ownerNfts}
                  selectedNFT={selectedNFT}
                  viewMode={viewMode}
                  onSelectNFT={handleSelectNFT}
                />
              </TabsContent>

              <TabsContent className="mt-4" value="collateral">
                <NFTGrid
                  nfts={ownerNfts}
                  selectedNFT={selectedNFT}
                  viewMode={viewMode}
                  onSelectNFT={handleSelectNFT}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface NFTGridProps {
  nfts: NFTSchemaType[];
  selectedNFT?: NFTSchemaType;
  onSelectNFT: (nft: NFTSchemaType) => void;
  viewMode: "grid" | "list";
}

function NFTGrid({ nfts, selectedNFT, onSelectNFT, viewMode }: NFTGridProps) {
  if (nfts.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <div className="text-center">
          <Grid3X3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No NFTs found</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-70">
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-1"
            : "space-y-2",
        )}
      >
        {nfts.map((nft, idx) => (
          <NFTCard
            key={idx}
            isSelected={
              selectedNFT?.contract.address === nft.contract.address &&
              selectedNFT?.tokenId === nft.tokenId
            }
            nft={nft}
            viewMode={viewMode}
            onSelect={() => onSelectNFT(nft)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

interface NFTCardProps {
  nft: NFTSchemaType;
  isSelected: boolean;
  onSelect: () => void;
  viewMode: "grid" | "list";
}

function NFTCard({ nft, isSelected, onSelect, viewMode }: NFTCardProps) {
  const findChainIcon = chainMetaMap[nft.chainId as ChainSupported].icon;

  if (viewMode === "list") {
    return (
      <button
        className={cn(
          "w-full p-3 rounded-lg border text-left hover:bg-accent/50 transition-colors",
          isSelected && "border-primary bg-primary/5",
        )}
        onClick={onSelect}
      >
        <div className="flex items-center gap-3">
          <TokenImageCustom
            address={nft.contract.address}
            className="w-12 h-12 rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{nft.name}</h3>
              {/* <Badge className="text-xs" variant="default">
                IP
              </Badge> */}
              <Image
                alt="Chain Icon"
                className="w-6 h-6 rounded-full border border-white"
                height={24}
                src={findChainIcon || "/placeholder.jpg"}
                width={24}
              />
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {nft.contract.symbol} • #{nft.tokenId}
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      className={cn(
        "p-3 rounded-lg border hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02]",
        isSelected && "border-primary bg-primary/5 ring-2 ring-primary/20",
      )}
      onClick={onSelect}
    >
      <div className="aspect-square mb-3 relative overflow-hidden rounded-lg">
        <TokenImageCustom
          address={nft.contract.address}
          className="w-full h-full object-cover"
        />
        <Image
          alt="Chain Icon"
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full border border-white"
          height={24}
          src={findChainIcon || "/placeholder.jpg"}
          width={24}
        />
      </div>
      <h3 className="font-medium text-sm mb-1 truncate">{nft.name}</h3>
      <p className="text-xs text-muted-foreground">#{nft.tokenId}</p>
    </button>
  );
}
