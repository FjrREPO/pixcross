import { gql } from "graphql-request";

export const queryAuctionSettledsByTokenId = (tokenId: number) => {
  return gql`{
    auctionSettleds(orderBy: blockTimestamp, orderDirection: desc, where: {tokenId: "${tokenId}"}) {
      transactionHash
      tokenId
      poolId
      loanToken
      id
      excess
      debtAmount
      collateralToken
      blockTimestamp
      blockNumber
      bidder
      bidAmount
    }
  }`;
};
