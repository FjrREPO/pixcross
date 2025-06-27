import { gql } from "graphql-request";

export const queryBridgesERC721ByAddress = (address: string) => {
  return gql`{
    erc721BridgeTransactions(orderBy: blockNumber, orderDirection: desc, where: {user: "${address.toLowerCase()}"}) {
      blockNumber
      burnedAt
      createdAt
      id
      lockedAt
      mintedAt
      sourceChainId
      status
      targetAddress
      targetChainId
      token
      tokenId
      transactionHash
      txHash
      unlockedAt
      updatedAt
      user
      bridgeRequest {
        bridgeFee
        bridgeType
        completedAt
        createdAt
        crossChainTxHash
        currentChainId
        destinationBlockNumber
        destinationChainId
        destinationTransactionHash
        direction
        expiresAt
        id
        initiatedAt
        lastUpdatedAt
        processedAt
        requestNonce
        sourceBlockNumber
        sourceChainId
        sourceTransactionHash
        status
        targetAddress
        token
        tokenId
        user
      }
    }
  }`;
};
