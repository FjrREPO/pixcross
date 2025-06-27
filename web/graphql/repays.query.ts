import { gql } from "graphql-request";

export const queryRepays = () => {
  return gql`
    {
      repays(orderBy: blockTimestamp, orderDirection: desc) {
        amount
        blockNumber
        blockTimestamp
        id
        onBehalfOf
        poolId
        sender
        shares
        transactionHash
        tokenId
      }
    }
  `;
};
