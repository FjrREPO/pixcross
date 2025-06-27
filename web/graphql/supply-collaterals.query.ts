import { gql } from "graphql-request";

export const querySupplyCollaterals = () => {
  return gql`
    {
      supplyCollaterals(orderBy: blockTimestamp, orderDirection: desc) {
        blockNumber
        blockTimestamp
        id
        onBehalfOf
        poolId
        sender
        tokenId
        transactionHash
      }
    }
  `;
};
