import { gql } from "graphql-request";

export const queryPoolAllocations = (curator: string) => {
  return gql`
    {
      poolAllocations(where: {curator_: {id: "${curator.toLowerCase()}"}}) {
        allocation
        poolId
        curator {
          id
        }
        pool {
          collateralAddress
          loanAddress
        }
      }
    }
  `;
};
