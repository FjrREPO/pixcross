import { gql } from "graphql-request";

export const queryAccountsByAddress = (address: string) => {
  return gql`{
    accounts(orderBy: blockTimestamp, orderDirection: desc, where: {id: "${address.toLowerCase()}"}) {
      id
      earn {
        balance
        curator
        curatorEntity {
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
        id
        shares
        totalDeposited
        totalWithdrawn
      }
      createdCurators {
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
      createdPools {
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
      lend {
        amount
        blockNumber
        blockTimestamp
        id
        onBehalfOf
        poolId
        sender
        shares
        transactionHash
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
      }
      positions {
        bidder
        borrowShares
        id
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
      }
    }
  }`;
};

export const queryAccountsEarnByAddress = (address: string) => {
  return gql`{
    account(id: "${address.toLowerCase()}") {
      id
      earn {
        balance
        curator
        curatorEntity {
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
        id
        shares
        totalDeposited
        totalWithdrawn
      }
    }
  }`;
};

export const queryAccountsLendByAddress = (address: string) => {
  return gql`{
    accounts(where: {id: "${address.toLowerCase()}"}) {
      id
      earn {
        balance
        curator
        id
        shares
        totalDeposited
        totalWithdrawn
      }
      lend {
        amount
        blockNumber
        blockTimestamp
        id
        onBehalfOf
        poolId
        sender
        shares
        transactionHash
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
      }
    }
  }`;
};

export const queryAccountLendByAddressAndCurator = (address: string) => {
  return gql`{
    account(id: "${address.toLowerCase()}") {
      id
      earn {
        balance
        curator
        id
        shares
        totalDeposited
        totalWithdrawn
      }
      lend {
        amount
        blockNumber
        blockTimestamp
        id
        onBehalfOf
        poolId
        sender
        shares
        transactionHash
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
      }
    }
  }`;
};

export const queryAccountsPositionsByAddress = (address: string) => {
  return gql`{
    accounts(where: {id: "${address.toLowerCase()}"}) {
      id
      positions {
        bidder
        borrowShares
        id
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
      }
    }
  }`;
};

export const queryAccountsPoolsByAddress = (address: string) => {
  return gql`{
    account(id: "${address.toLowerCase()}") {
      id
      createdPools {
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
      lend {
        amount
        blockNumber
        blockTimestamp
        id
        onBehalfOf
        poolId
        sender
        shares
        transactionHash
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
      }
    }
  }`;
};

export const queryAccountsCuratorsByAddress = (address: string) => {
  return gql`{
    account(id: "${address.toLowerCase()}") {
      id
      createdCurators {
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
  }`;
};
