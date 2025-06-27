import { gql } from "graphql-request";

export interface TokenLocked {
  id: string;
  token: string;
  tokenId: string;
  user: string;
  targetChainId: string;
  targetAddress: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface TokenBurned {
  id: string;
  token: string;
  tokenId: string;
  user: string;
  targetChainId: string;
  targetAddress: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface TokenMinted {
  id: string;
  token: string;
  tokenId: string;
  user: string;
  sourceChainId: string;
  txHash: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface TokenUnlocked {
  id: string;
  token: string;
  tokenId: string;
  user: string;
  sourceChainId: string;
  txHash: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface BridgeData {
  tokenLockeds: TokenLocked[];
  tokenBurneds: TokenBurned[];
  tokenMinteds: TokenMinted[];
  tokenUnlockeds: TokenUnlocked[];
}

// Query for getting locked tokens (to be minted on destination chain)
export const GET_LOCKED_TOKENS = gql`
  query GetLockedTokens($lastBlockTimestamp: String!) {
    tokenLockeds(
      where: { blockTimestamp_gt: $lastBlockTimestamp }
      orderBy: blockTimestamp
      orderDirection: asc
      first: 100
    ) {
      id
      token
      tokenId
      user
      targetChainId
      targetAddress
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// Query for getting burned tokens (to be minted on destination chain)
export const GET_BURNED_TOKENS = gql`
  query GetBurnedTokens($lastBlockTimestamp: String!) {
    tokenBurneds(
      where: { blockTimestamp_gt: $lastBlockTimestamp }
      orderBy: blockTimestamp
      orderDirection: asc
      first: 100
    ) {
      id
      token
      tokenId
      user
      targetChainId
      targetAddress
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// Query for getting minted tokens (already processed)
export const GET_MINTED_TOKENS = gql`
  query GetMintedTokens($lastBlockTimestamp: String!) {
    tokenMinteds(
      where: { blockTimestamp_gt: $lastBlockTimestamp }
      orderBy: blockTimestamp
      orderDirection: asc
      first: 100
    ) {
      id
      token
      tokenId
      user
      sourceChainId
      txHash
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// Query for getting unlocked tokens (already processed)
export const GET_UNLOCKED_TOKENS = gql`
  query GetUnlockedTokens($lastBlockTimestamp: String!) {
    tokenUnlockeds(
      where: { blockTimestamp_gt: $lastBlockTimestamp }
      orderBy: blockTimestamp
      orderDirection: asc
      first: 100
    ) {
      id
      token
      tokenId
      user
      sourceChainId
      txHash
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// Get all bridge events since a specific timestamp
export const GET_ALL_BRIDGE_EVENTS = gql`
  query GetAllBridgeEvents($lastBlockTimestamp: String!) {
    tokenLockeds(
      where: { blockTimestamp_gt: $lastBlockTimestamp }
      orderBy: blockTimestamp
      orderDirection: asc
      first: 100
    ) {
      id
      token
      tokenId
      user
      targetChainId
      targetAddress
      blockNumber
      blockTimestamp
      transactionHash
    }
    tokenBurneds(
      where: { blockTimestamp_gt: $lastBlockTimestamp }
      orderBy: blockTimestamp
      orderDirection: asc
      first: 100
    ) {
      id
      token
      tokenId
      user
      targetChainId
      targetAddress
      blockNumber
      blockTimestamp
      transactionHash
    }
    tokenMinteds(
      where: { blockTimestamp_gt: $lastBlockTimestamp }
      orderBy: blockTimestamp
      orderDirection: asc
      first: 100
    ) {
      id
      token
      tokenId
      user
      sourceChainId
      txHash
      blockNumber
      blockTimestamp
      transactionHash
    }
    tokenUnlockeds(
      where: { blockTimestamp_gt: $lastBlockTimestamp }
      orderBy: blockTimestamp
      orderDirection: asc
      first: 100
    ) {
      id
      token
      tokenId
      user
      sourceChainId
      txHash
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
