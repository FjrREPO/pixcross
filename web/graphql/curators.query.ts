import { gql } from "graphql-request";

export const queryCurators = () => {
  return gql`
    {
      curators(orderBy: blockTimestamp, orderDirection: desc) {
        allocations
        asset
        blockNumber
        blockTimestamp
        curator
        currentLendAPR
        feePercentage
        feeRecipient
        id
        name
        paused
        symbol
        totalShares
        totalAssets
        transactionHash
        lendAPRHistory {
          apr
          blockNumber
          blockTimestamp
          totalAllocated
        }
        pools {
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
    }
  `;
};

export const queryCuratorById = (id: string) => {
  return gql`
    {
      curator(id: "${id}") {
        allocations
        asset
        blockNumber
        blockTimestamp
        curator
        currentLendAPR
        feePercentage
        feeRecipient
        id
        name
        paused
        symbol
        totalShares
        totalAssets
        transactionHash
        lendAPRHistory {
          apr
          blockNumber
          blockTimestamp
          totalAllocated
        }
        pools {
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
    }
  `;
};
