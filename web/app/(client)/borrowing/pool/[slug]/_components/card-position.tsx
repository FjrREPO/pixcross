import React, { useState } from "react";
import { Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { PoolType } from "@/types/graphql/pool.type";
import { PositionType } from "@/types/graphql/position.type";
import PositionDialog from "@/components/dialog/dialog-position";
import { TokenSymbol } from "@/components/token/token-symbol";
import { NFTSchemaType } from "@/types/api/nft.type";
import { usePixcrossNFTMultichain } from "@/hooks/query/api/use-pixcross-nft-multichain";
import { normalize } from "@/lib/helper/bignumber";
import { formatCompactNumber } from "@/lib/helper/number";

interface NFTSelectionCardProps {
  data: PoolType | undefined;
  positions: PositionType[] | undefined;
  className?: string;
}

export default function NFTSelectionCard({
  data,
  positions,
  className,
}: NFTSelectionCardProps) {
  const [selectedNFT, setSelectedNFT] = useState<NFTSchemaType | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<PositionType | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: rawNftsMetadata } = usePixcrossNFTMultichain();

  const nftsMetadata = rawNftsMetadata?.filter(
    (nft) =>
      positions?.some(
        (position) =>
          position.tokenId === nft.tokenId &&
          position.pool.id === data?.id &&
          position.pool.collateralAddress.toLowerCase() ===
            nft.contract.address.toLowerCase(),
      ) ?? false,
  );

  const handleSelectNFT = (nft: NFTSchemaType, position: PositionType) => {
    setSelectedNFT(nft);
    setSelectedPosition(position);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedNFT(null);
    setSelectedPosition(null);
  };

  return (
    <React.Fragment>
      <PositionDialog
        data={data}
        nftMetadata={selectedNFT}
        open={isDialogOpen}
        position={selectedPosition}
        onClose={handleCloseDialog}
      />
      <Card
        className={cn("transition-all duration-200 hover:shadow-lg", className)}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                Your IP NFT Positions
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Select an NFT position to manage your collateral and borrowing
                activities.
              </CardDescription>
            </div>
            <Wallet className="w-5 h-5 text-muted-foreground" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {nftsMetadata.length === 0 ? (
            <div className="flex items-center justify-center min-h-40">
              <div className="text-center py-8 text-muted-foregroun">
                <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No positions found</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {nftsMetadata.map((nft, index) => {
                const position = (positions ?? [])[index];

                return (
                  <Card
                    key={`${nft.contract.address}-${nft.tokenId}`}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-2 hover:border-primary/50 p-0 py-3"
                    onClick={() => handleSelectNFT(nft, position)}
                  >
                    <CardContent className="px-4">
                      <div className="flex items-center gap-4">
                        <TokenImageCustom
                          address={nft.contract.address}
                          className="w-16 h-16 rounded-lg flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold truncate">
                              {nft.contract.name}
                            </h3>
                            <Badge className="text-xs" variant="outline">
                              #{nft.tokenId}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Borrowed</p>
                              <div className="flex items-center gap-1">
                                <TokenImageCustom
                                  address={data?.loanAddress}
                                  className="w-4 h-4"
                                />
                                <span className="font-medium">
                                  {formatCompactNumber(
                                    normalize(position?.borrowShares ?? 0, 18),
                                  )}
                                </span>
                                <TokenSymbol
                                  address={data?.loanAddress}
                                  className="font-medium"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge className="text-xs" variant="default">
                            Active
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {position?.pool.lendingRate || "0"}% APR
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
