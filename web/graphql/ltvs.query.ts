import { gql } from "graphql-request";

export const queryLTVs = () => {
  return gql`
    {
      ltvs(orderBy: blockTimestamp, orderDirection: desc) {
        blockNumber
        blockTimestamp
        id
        ltv
        transactionHash
      }
    }
  `;
};
