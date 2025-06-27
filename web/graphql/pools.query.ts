import { gql } from "graphql-request";

export const queryPools = () => {
  return gql`
    {
      pools(orderBy: blockTimestamp, orderDirection: desc) {
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
    }
  `;
};

export const queryPoolById = (id: string) => {
  return gql`
    {
      pool(id: "${id}") {
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
    }
  `;
};

export const queryPoolByAddress = (address: string) => {
  return gql`
    {
      pool(id: "${address}") {
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
    }
  `;
};
