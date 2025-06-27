import { gql } from "graphql-request";

export const queryBorrowsByAddress = (address: string) => {
  return gql`{
    borrows(orderBy: blockTimestamp, orderDirection: desc, where: {sender: "${address.toLowerCase()}"}) {
      amount
      blockNumber
      blockTimestamp
      id
      onBehalfOf
      poolId
      receiver
      sender
      shares
      tokenId
      transactionHash
    }
  }`;
};
