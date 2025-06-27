import { gql } from "graphql-request";

export const queryBridgesByAddress = (address: string) => {
  return gql`{
    bridgeTransactions(orderBy: blockNumber, orderDirection: desc, where: {sender: "${address.toLowerCase()}"}) {
      amount
      blockNumber
      bridgedAt
      createdAt
      destinationChain
      fee
      id
      messageId
      receivedAt
      receiver
      sender
      sourceChain
      status
      token
      transactionHash
      updatedAt
    }
  }`;
};
