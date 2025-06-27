import { gql } from "graphql-request";

export const queryAuctionStartedsByAddress = (address: string) => {
  return gql`{
    auctionStarteds(orderBy: blockTimestamp, orderDirection: desc, where: {owner: "${address.toLowerCase()}"}) {
      blockNumber
      blockTimestamp
      debtAmount
      endTime
      id
      internal_id
      owner
      startTime
      tokenId
      transactionHash
      collateralToken
      loanToken
    }
  }`;
};

export const queryAuctionStarteds = () => {
  return gql`
    {
      auctionStarteds(orderBy: blockTimestamp, orderDirection: desc) {
        blockNumber
        blockTimestamp
        debtAmount
        endTime
        id
        internal_id
        owner
        startTime
        tokenId
        transactionHash
        collateralToken
        loanToken
      }
    }
  `;
};
