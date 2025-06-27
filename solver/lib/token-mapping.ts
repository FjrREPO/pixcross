import { contractAddresses } from './constants';

/**
 * Maps a token address from source chain to corresponding address on target chain
 * @param sourceChainId Source chain ID
 * @param targetChainId Target chain ID
 * @param sourceTokenAddress Token address on source chain
 * @returns Corresponding token address on target chain, or null if not found
 */
export function mapTokenAddress(
  sourceChainId: number,
  targetChainId: number,
  sourceTokenAddress: string
): string | null {
  // Get the source chain's token addresses
  const sourceChain = contractAddresses[sourceChainId as keyof typeof contractAddresses];
  if (!sourceChain) {
    return null;
  }

  // Get the target chain's token addresses
  const targetChain = contractAddresses[targetChainId as keyof typeof contractAddresses];
  if (!targetChain) {
    return null;
  }

  // Find the index of the source token address
  const sourceIndex = sourceChain.ips.findIndex(
    addr => addr.toLowerCase() === sourceTokenAddress.toLowerCase()
  );

  if (sourceIndex === -1) {
    return null; // Token not found in source chain
  }

  // Get the corresponding token address on target chain
  if (sourceIndex >= targetChain.ips.length) {
    return null; // Target chain doesn't have this token index
  }

  return targetChain.ips[sourceIndex];
}

/**
 * Get all supported chain IDs
 */
export function getSupportedChainIds(): number[] {
  return Object.keys(contractAddresses).map(Number);
}

/**
 * Check if a chain ID is supported
 */
export function isChainSupported(chainId: number): boolean {
  return chainId in contractAddresses;
}

/**
 * Get token collection name by index
 */
export function getTokenCollectionName(index: number): string {
  const collectionNames = [
    'Bored Ape Yacht Club',
    'Pudgy Penguins', 
    'Azuki',
    'Cool Cats',
    'CryptoPunks',
    'Doodles',
    'Lazy Lions',
    'Lil Pudgys',
    'Mutant Ape Yacht Club',
    'Milady Maker',
    'Mocaverse',
    'Moonbirds'
  ];

  return collectionNames[index] || `Unknown Collection ${index}`;
}

