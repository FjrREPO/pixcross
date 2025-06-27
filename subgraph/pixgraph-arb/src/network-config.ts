// Network Configuration for ERC721 Bridge
// Update this file based on your deployment network

import { BigInt } from "@graphprotocol/graph-ts"

// Network configuration class
export class NetworkConfig {
  static getChainId(): BigInt {
    // TODO: Update this based on your deployment network
    // This should match the network specified in subgraph.yaml
    
    // Common chain IDs:
    // return BigInt.fromI32(11155111)  // Sepolia Testnet
    // return BigInt.fromI32(84532)     // Base Sepolia Testnet
    return BigInt.fromI32(421614)    // Arbitrum Sepolia Testnet
    // return BigInt.fromI32(43113)     // Avalanche Sepolia Testnet
  }
  
  static getNetworkName(): string {
    // return "sepolia"  // Update this to match your network name
    // return "base-sepolia"
    return "arbitrum-sepolia"
    // return "avalanche-sepolia"
  }
  
  static getBridgeFeeDefault(): BigInt {
    // Default bridge fee in wei (0.0001 ETH)
    return BigInt.fromString("100000000000000")
  }
  
  static getExpirationTime(): BigInt {
    // Default expiration time in seconds (24 hours)
    return BigInt.fromI32(86400)
  }
}

