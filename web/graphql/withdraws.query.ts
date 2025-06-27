import { gql } from "graphql-request";

export const queryWithdraws = () => {
  return gql`
    {
      withdraws(orderBy: blockTimestamp, orderDirection: desc) {
        amount
        blockNumber
        blockTimestamp
        id
        onBehalfOf
        poolId
        receiver
        sender
        shares
        transactionHash
      }
    }
  `;
};
