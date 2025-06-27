import { gql } from "graphql-request";

export const queryPositions = (account: string) => {
  return gql`
    {
      positions(where: {account_: {id: "${account.toLowerCase()}"}}) {
        bid
        id
        endTime
        borrowShares
        bidder
        tokenId
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
        account {
          id
        }
      }
    }
  `;
};
