import { gql } from "graphql-request";

export const queryAccrueds = (address: string) => {
  return gql`{
    accrueds(orderBy: blockTimestamp, orderDirection: desc, where: {sender: "${address}"}) {
      blockNumber
      blockTimestamp
      borrowRate
      feeShares
      id
      interest
      poolId
      transactionHash
    }
  }`;
};
