import { gql } from "graphql-request";

export const querySupplies = () => {
  return gql`
    {
      supplies(orderBy: blockTimestamp, orderDirection: desc) {
        amount
        blockNumber
        blockTimestamp
        id
        onBehalfOf
        poolId
        pool {
          blockNumber
          blockTimestamp
          borrowAPY
          borrowRate
          collateralAddress
          collateralToken {
            collateralToken
            id
          }
          id
          irm
          lendingRate
          loanAddress
          loanToken {
            id
            loanToken
          }
          lth
          ltv
          oracle
          supplyAPY
          supplyAssets {
            amount
            id
            sender
            shares
            poolId
            onBehalfOf
            blockNumber
            blockTimestamp
            transactionHash
          }
          totalBorrowAssets
          totalBorrowShares
          totalSupplyAssets
          totalSupplyShares
          transactionHash
          utilizationRate
        }
        sender
        shares
        transactionHash
      }
    }
  `;
};
