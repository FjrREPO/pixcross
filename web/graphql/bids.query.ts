import { gql } from "graphql-request";

export const queryAuctionBidsByPoolIdAndTokenId = (
  poolId: string,
  tokenId: number,
) => {
  return gql`{
    bids(orderBy: blockTimestamp, orderDirection: desc, where: {poolId: "${poolId}", tokenId: "${tokenId}"}) {
      amount
      bidder
      blockNumber
      blockTimestamp
      collateralToken
      id
      loanToken
      poolId
      previousBid
      previousBidder
      tokenId
      transactionHash
    }
  }`;
};
