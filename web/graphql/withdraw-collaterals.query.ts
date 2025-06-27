import { gql } from "graphql-request";

export const queryWithdrawCollaterals = () => {
  return gql`
    {
      withdrawCollaterals(orderBy: blockTimestamp, orderDirection: desc) {
        blockNumber
        blockTimestamp
        id
        onBehalfOf
        poolId
        receiver
        sender
        tokenId
        transactionHash
      }
    }
  `;
};
