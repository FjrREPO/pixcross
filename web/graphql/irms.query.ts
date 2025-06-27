import { gql } from "graphql-request";

export const queryInterestRateModels = () => {
  return gql`
    {
      interestRateModels(orderBy: blockTimestamp, orderDirection: desc) {
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
    }
  `;
};
