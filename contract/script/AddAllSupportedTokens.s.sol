// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "../src/bridge/PixcrossBridgeERC721.sol";

/**
 * @title Add All Supported Tokens Script
 * @dev Script to add all multichain token addresses as supported on a bridge contract
 */
contract AddAllSupportedTokens is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Adding all supported tokens with account:", deployer);
        console.log("Account balance:", deployer.balance);
        
        // Check current chain ID
        uint256 currentChainId = block.chainid;
        console.log("Current Chain ID:", currentChainId);
        
        // Define bridge addresses for each chain
        address bridgeAddress;
        address[] memory tokensToAdd;
        
        if (currentChainId == 421614) {
            // Arbitrum Sepolia
            bridgeAddress = 0x71E326c9e5A1f0D11c751e4f56e1E738499459FD;
            tokensToAdd = getArbitrumSepoliaTokens();
        } else if (currentChainId == 11155111) {
            // Ethereum Sepolia
            bridgeAddress = 0xcb34FaE85D2D061b6d067829a50513850337eB0e;
            tokensToAdd = getEthereumSepoliaTokens();
        } else if (currentChainId == 84532) {
            // Base Sepolia
            bridgeAddress = 0xF12610EDfC06c1dBbfC679a0b39068b11423f3bf;
            tokensToAdd = getBaseSepoliaTokens();
        } else if (currentChainId == 43113) {
            // Avalanche Fuji
            bridgeAddress = 0x644b668fA603F4670fe007839CEE75EA364f8A75;
            tokensToAdd = getAvalancheFujiTokens();
        } else {
            revert("Unsupported chain ID");
        }
        
        console.log("Bridge address:", bridgeAddress);
        console.log("Tokens to add:", tokensToAdd.length);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Get bridge contract instance
        PixcrossBridgeERC721 bridge = PixcrossBridgeERC721(bridgeAddress);
        
        // Add all tokens as supported
        for (uint256 i = 0; i < tokensToAdd.length; i++) {
            address tokenToAdd = tokensToAdd[i];
            
            // Check if token is already supported
            bool isSupported = bridge.supportedTokens(tokenToAdd);
            
            if (!isSupported) {
                bridge.addSupportedToken(tokenToAdd);
                console.log("Added token:", tokenToAdd);
            } else {
                console.log("Token already supported:", tokenToAdd);
            }
        }
        
        vm.stopBroadcast();
        
        console.log("Script completed successfully");
    }
    
    function getEthereumSepoliaTokens() internal pure returns (address[] memory) {
        address[] memory tokens = new address[](12);
        tokens[0] = 0xDcff21DC802cfED4399f7A296C091c2ED567BCB5;
        tokens[1] = 0x457F22CeE730E62610D0939CF15f85a17adDBd53;
        tokens[2] = 0xf2A19F5E51D1b98DEbF3C0a5fC0BB729b6A08d31;
        tokens[3] = 0x36ae9954Af91eD6b5d592c6f6Ea3405De20FaD79;
        tokens[4] = 0x70cea8013b7FC58778984d851558E2B9a03346cB;
        tokens[5] = 0xa8F0F1699B15f872328cFBBFDf253689B2c681E1;
        tokens[6] = 0x0aa8F05F0f5902CacF354f72ECfC38E96560B5f5;
        tokens[7] = 0xcB76b94AC33F132f48d940AbB344FC66185dECa3;
        tokens[8] = 0xC7E5e72622968c4910954AdB1FCAfdBa099AA9a1;
        tokens[9] = 0xFd60be52c84d413eD28F8150485ba0dBf74937F5;
        tokens[10] = 0x39BB27C7528D03Ecb858A843d59036F3F86d2A5B;
        tokens[11] = 0x10Cd88DCdC3FeE7786D72aB3AF5f4Bf41737cc68;
        return tokens;
    }
    
    function getBaseSepoliaTokens() internal pure returns (address[] memory) {
        address[] memory tokens = new address[](12);
        tokens[0] = 0x0E70F31a4431499E6a5E1a451a80BF3126369506;
        tokens[1] = 0x156bE6a24C7C72709Cc04caD2e7B17D2837CC3c1;
        tokens[2] = 0xfb6d059287139c038458F6b1A53fE524718fD8E2;
        tokens[3] = 0x36A829e9B6456053BAC29B2043C06155645BFe83;
        tokens[4] = 0xdBa82A51677E064D24cf3E1909009179cA5b3f1d;
        tokens[5] = 0xa6c19488188DF4e725a779Dffc2d7956b22A3087;
        tokens[6] = 0xC88CC12C87dc289eBad476bB5dBd56B3e97519Cb;
        tokens[7] = 0x1E36b31fb4748767BF55CDA552335ec15E25c2A4;
        tokens[8] = 0xe14ba40aa87345Be861422F96dfD05638D03F440;
        tokens[9] = 0x45D05755Fd89f171ba4146878297c40f169B6AC1;
        tokens[10] = 0xD0aE275f13Dfb3eeBBDFb8E60f2C4c31A560006b;
        tokens[11] = 0xE8E0D86B53215154FBCC496821E95C51264f2252;
        return tokens;
    }
    
    function getArbitrumSepoliaTokens() internal pure returns (address[] memory) {
        address[] memory tokens = new address[](12);
        tokens[0] = 0x281f93421A8575544CA99CdF5f4E17F8Aa330F0b;
        tokens[1] = 0x6089F2859c98b8B9a506586bC4351670620F5b1a;
        tokens[2] = 0x5B8A7652c606C560CE4B6dD35CfE1a01972ed426;
        tokens[3] = 0x033e6e9f1B077ea31b183e2d932160d5E1F9b6B9;
        tokens[4] = 0xb4Dd259c298dc7552c2eA4D615c8DdA1897679c9;
        tokens[5] = 0x045DE035449b8E3c764848195dE48044E842A4E3;
        tokens[6] = 0xc173b549037BA015F668871CF3d266DB65794E65;
        tokens[7] = 0xF2041D32916B114345f2ac11E4A218193Fd24d9E;
        tokens[8] = 0x63ED1E6fd8B901aC07F921e998e09207188846e4;
        tokens[9] = 0x6744380693be09CAf8Fadb83CA525B2F973C16Ff;
        tokens[10] = 0x2Bb0E38A57449EE72d2D5C471d19b4886e19059C;
        tokens[11] = 0xC1C458A5794881f32EDAb49eb33CdE0ec7e38dF7;
        return tokens;
    }
    
    function getAvalancheFujiTokens() internal pure returns (address[] memory) {
        address[] memory tokens = new address[](12);
        tokens[0] = 0xFaBdc025E40E408ADD0A5d9aBe0578E6742bE33e;
        tokens[1] = 0x57d4c6094DD74AA7B16da28170a0f9e450816407;
        tokens[2] = 0x748250DfeB65a31466147BFF3C9bcED271f4A18F;
        tokens[3] = 0x5365Ff8971bbc05BB11e9eF294D4E5b59a89A68c;
        tokens[4] = 0x71f2d0A8B8B7Cd3046950DF7474dA35dd4EB2D8D;
        tokens[5] = 0x8Ae42907d4360A9443802916c761e52Ff182Db05;
        tokens[6] = 0x27e29e6DdA9Dbc63fD7b8c7BEb5DCe20484Ef246;
        tokens[7] = 0x972b7ECDe14e978792033F54fD812D1e6A88b31f;
        tokens[8] = 0xbB7824b883cc5f0801EFDE4880B56d04b5bd9771;
        tokens[9] = 0xE7217904b0412025eA1285eAEBaEFd49370A82ae;
        tokens[10] = 0x312286BeAf7A2710A2d1bC3662cEad60989496C5;
        tokens[11] = 0xFe424b5b85C742C15CCB09d62873bE72577CD7Ef;
        return tokens;
    }
    
    function getChainName(uint256 chainId) internal pure returns (string memory) {
        if (chainId == 11155111) return "Ethereum Sepolia";
        if (chainId == 84532) return "Base Sepolia";
        if (chainId == 421614) return "Arbitrum Sepolia";
        if (chainId == 43113) return "Avalanche Fuji";
        return "Unknown Chain";
    }
}

