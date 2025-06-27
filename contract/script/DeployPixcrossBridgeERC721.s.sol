// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "../src/bridge/PixcrossBridgeERC721.sol";
import "../src/nft/MockERC721.sol";
import "./Helper.sol";

/**
 * @title Deploy PixcrossBridgeERC721 Script
 * @dev Script to deploy PixcrossBridgeERC721 and related contracts
 */
contract DeployPixcrossBridgeERC721 is Script, Helper {
    struct NFTCollection {
        string name;
        string symbol;
        string baseURI;
    }

    // State variables to store deployed addresses
    PixcrossBridgeERC721 public bridge;
    MockERC721[] public deployedNFTs;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);

        // Check minimum balance requirement
        require(
            deployer.balance >= 0.001 ether,
            "Insufficient balance for deployment"
        );

        vm.startBroadcast(deployerPrivateKey);

        // Get current chain ID
        uint256 currentChainId = block.chainid;
        console.log("Current Chain ID:", currentChainId);

        // Validate supported chain
        require(
            isSupportedChain(currentChainId),
            "Unsupported chain for deployment"
        );

        // Deploy Bridge Contract
        bridge = new PixcrossBridgeERC721(
            currentChainId,
            deployer // Fee collector
        );

        console.log(
            "PixcrossBridgeERC721 Bridge deployed to:",
            address(bridge)
        );

        // Deploy NFT Collections
        NFTCollection[] memory collections = getCollections();
        deployedNFTs = new MockERC721[](collections.length);

        for (uint256 i = 0; i < collections.length; i++) {
            // Deploy NFT contract
            deployedNFTs[i] = new MockERC721(
                collections[i].name,
                collections[i].symbol,
                collections[i].baseURI
            );

            console.log("mockIP", i, " deployed to:", address(deployedNFTs[i]));

            // Setup bridge configuration for this token
            setupTokenConfiguration(deployedNFTs[i], currentChainId);
        }

        // Setup bridge global configuration
        setupBridgeGlobalConfiguration(currentChainId);

        vm.stopBroadcast();

        // Log deployment summary
        logDeploymentSummary(currentChainId);

        console.log("All contracts deployed and configured successfully");
    }

    function getCollections() internal pure returns (NFTCollection[] memory) {
        NFTCollection[] memory collections = new NFTCollection[](12);

        collections[0] = NFTCollection(
            "Bored Ape Yacht Club",
            "BAYC",
            "ipfs://QmZ9zZTS75F4d7NPt8QKUTXsP99R6sQo5HdoENS68mSM6Z/"
        );
        collections[1] = NFTCollection(
            "Pudgy Penguins",
            "PUDGY",
            "ipfs://Qmd4L7K3YTT2VEK8hto2GHpNNziHcLHAWfQaoLdUqfc9yS/"
        );
        collections[2] = NFTCollection(
            "Azuki",
            "AZUKI",
            "ipfs://QmWzq3cVD7YWFMm12E9UDxBsnVLsQps5jQQQfSYhnSADXb/"
        );
        collections[3] = NFTCollection(
            "Cool Cats",
            "COOL",
            "ipfs://QmNQY6q2k7xzSbHzjfh3Agq6N1iyeEJrWEY6QhFh8hxmzK/"
        );
        collections[4] = NFTCollection(
            "CryptoPunks",
            "PUNK",
            "ipfs://QmSvC9ZbDAS2u1ed15GTbtst9ZAgQwe99jNVermFhEpqMK/"
        );
        collections[5] = NFTCollection(
            "Doodles",
            "DOODLE",
            "ipfs://QmSmu6736cw9atfDCZPWRsbJw2V6gsCCPsSfChYUr14Q4q/"
        );
        collections[6] = NFTCollection(
            "Lazy Lions",
            "LION",
            "ipfs://QmZkd6VYfW5GY2mjDKc8hhuTxxZuYTvzy7yKarzVoZdsAy/"
        );
        collections[7] = NFTCollection(
            "Lil Pudgys",
            "LILPUDGY",
            "ipfs://QmRtVNSoi7zq9vvcDJYubvhB24VkcZ4Hgmtmdm4i59r6kH/"
        );
        collections[8] = NFTCollection(
            "Mutant Ape Yacht Club",
            "MAYC",
            "ipfs://QmeWgy6RCLTyfVu6c2jUsr57Ld4KqGaSbRhVcKdNcprJ2D/"
        );
        collections[9] = NFTCollection(
            "Milady Maker",
            "MILADY",
            "ipfs://QmT7pRxWZSChTfrjgN8JqUS4BiAmhSppQZpCDXsSArdPuz/"
        );
        collections[10] = NFTCollection(
            "Mocaverse",
            "MOCA",
            "ipfs://QmZi8mDT17oKSKwYivGF2ddiNJC9Ckk4nXzQ7Gx4bntipC/"
        );
        collections[11] = NFTCollection(
            "Moonbirds",
            "MOON",
            "ipfs://Qmcu2LpzU36EsMfCqsn5wmHr3j7JHX3HeryashC3VAGfkE/"
        );

        return collections;
    }

    function setupTokenConfiguration(
        MockERC721 nftContract,
        uint256 
    ) internal {
        console.log(
            "Setting up token configuration for:",
            address(nftContract)
        );

        // Add token to bridge's supported tokens
        bridge.addSupportedToken(address(nftContract));

        // Add bridge contract as authorized minter/burner
        nftContract.addBridgeContract(address(bridge));

        console.log("Token configuration completed for:", address(nftContract));
    }

    function setupBridgeGlobalConfiguration(uint256 currentChainId) internal {
        console.log("Setting up bridge global configuration...");

        uint256[] memory supportedChains = getSupportedChains(currentChainId);

        for (uint256 i = 0; i < supportedChains.length; i++) {
            bridge.addSupportedChain(supportedChains[i]);
            console.log("Added supported chain:", supportedChains[i]);
        }

        // Set bridge fee (0.0001 ETH)
        bridge.setBridgeFee(0.0001 ether);
        console.log("Bridge fee set to: 0.0001 ETH");

        console.log("Bridge global configuration completed");
    }

    function getSupportedChains(
        uint256 currentChainId
    ) internal pure returns (uint256[] memory) {
        uint256[] memory chains;

        if (currentChainId == 11155111) {
            // Ethereum Sepolia - support Base, Arbitrum, Avalanche testnets
            chains = new uint256[](3);
            chains[0] = 84532; // Base Sepolia
            chains[1] = 421614; // Arbitrum Sepolia
            chains[2] = 43113; // Avalanche Fuji
        } else if (currentChainId == 84532) {
            // Base Sepolia - support Ethereum, Arbitrum, Avalanche testnets
            chains = new uint256[](3);
            chains[0] = 11155111; // Ethereum Sepolia
            chains[1] = 421614; // Arbitrum Sepolia
            chains[2] = 43113; // Avalanche Fuji
        } else if (currentChainId == 421614) {
            // Arbitrum Sepolia - support Ethereum, Base, Avalanche testnets
            chains = new uint256[](3);
            chains[0] = 11155111; // Ethereum Sepolia
            chains[1] = 84532; // Base Sepolia
            chains[2] = 43113; // Avalanche Fuji
        } else if (currentChainId == 43113) {
            // Avalanche Fuji - support Ethereum, Base, Arbitrum testnets
            chains = new uint256[](3);
            chains[0] = 11155111; // Ethereum Sepolia
            chains[1] = 84532; // Base Sepolia
            chains[2] = 421614; // Arbitrum Sepolia
        } else {
            // Fallback for unsupported chains
            chains = new uint256[](0);
        }

        return chains;
    }

    function isSupportedChain(uint256 chainId) internal pure returns (bool) {
        return
            chainId == 11155111 || // Ethereum Sepolia
            chainId == 84532 || // Base Sepolia
            chainId == 421614 || // Arbitrum Sepolia
            chainId == 43113; // Avalanche Fuji
    }

    function getChainName(
        uint256 chainId
    ) internal pure returns (string memory) {
        if (chainId == 11155111) return "Ethereum Sepolia";
        if (chainId == 84532) return "Base Sepolia";
        if (chainId == 421614) return "Arbitrum Sepolia";
        if (chainId == 43113) return "Avalanche Fuji";
        return "Unknown Chain";
    }

    function logDeploymentSummary(uint256 currentChainId) internal view {
        console.log(
            "\n"
            "========================================"
        );
        console.log("        DEPLOYMENT SUMMARY");
        console.log("========================================");
        console.log("Network:", getChainName(currentChainId));
        console.log("Chain ID:", currentChainId);
        console.log("Bridge Contract:", address(bridge));
        console.log("Bridge Fee:", "0.001 ETH");
        console.log("NFT Collections Deployed:", deployedNFTs.length);

        console.log(
            "\n"
            "NFT Contracts:"
        );
        console.log("----------------------------------------");
        NFTCollection[] memory collections = getCollections();
        for (
            uint256 i = 0;
            i < deployedNFTs.length && i < collections.length;
            i++
        ) {
            console.log(
                string(abi.encodePacked(collections[i].symbol, ": ")),
                address(deployedNFTs[i])
            );
        }

        uint256[] memory supportedChains = getSupportedChains(currentChainId);
        console.log(
            "\n"
            "Supported Destination Chains:"
        );
        console.log("----------------------------------------");
        for (uint256 i = 0; i < supportedChains.length; i++) {
            console.log(
                string(
                    abi.encodePacked(
                        "- ",
                        getChainName(supportedChains[i]),
                        " ("
                    )
                ),
                supportedChains[i],
                ")"
            );
        }

        console.log(
            "\n"
            "========================================"
        );
        console.log("           NEXT STEPS");
        console.log("========================================");
        console.log("1. Deploy this script on other chains");
        console.log("2. Set up cross-chain message operators");
        console.log("3. Configure bridge operators/validators");
        console.log("4. Test bridging functionality");
        console.log("5. Set up monitoring and alerts");
        console.log("========================================");
    }

    // Helper function to get deployment addresses (useful for testing)
    function getDeployedAddresses()
        external
        view
        returns (address bridgeAddress, address[] memory nftAddresses)
    {
        bridgeAddress = address(bridge);
        nftAddresses = new address[](deployedNFTs.length);
        for (uint256 i = 0; i < deployedNFTs.length; i++) {
            nftAddresses[i] = address(deployedNFTs[i]);
        }
    }
}
