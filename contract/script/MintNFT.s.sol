// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "./Helper.sol";

interface IERC721 {
    function mint(address to) external returns (uint256);
    function getCurrentTokenId() external view returns (uint256);
}

contract MintNFT is Script, Helper {
    function run(SupportedNetworks network) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);
        address senderAddress = vm.addr(senderPrivateKey);

        uint256 TOTAL_MINT = 2;

        address[] memory nftAddresses = getNFTsByNetwork(network);
        string memory networkLabel = getNetworkLabel(network);

        for (uint256 i = 0; i < nftAddresses.length; i++) {
            IERC721 nft = IERC721(nftAddresses[i]);
            string memory label = string.concat("mockIP", vm.toString(i + 1));

            if (nft.getCurrentTokenId() < TOTAL_MINT) {
                nft.mint(senderAddress);
                console.log("%s minted on %s", label, networkLabel);
            } else {
                console.log("%s already minted on %s", label, networkLabel);
            }
        }

        console.log("Minted NFTs complete from IPs on %s", networkLabel);
        vm.stopBroadcast();
    }

    function getNFTsByNetwork(SupportedNetworks network) internal pure returns (address[] memory) {
        if (network == SupportedNetworks.ETHEREUM_SEPOLIA) {
            address[] memory arr = new address[](12);
            arr[0] = mockIP1EthereumSepolia;
            arr[1] = mockIP2EthereumSepolia;
            arr[2] = mockIP3EthereumSepolia;
            arr[3] = mockIP4EthereumSepolia;
            arr[4] = mockIP5EthereumSepolia;
            arr[5] = mockIP6EthereumSepolia;
            arr[6] = mockIP7EthereumSepolia;
            arr[7] = mockIP8EthereumSepolia;
            arr[8] = mockIP9EthereumSepolia;
            arr[9] = mockIP10EthereumSepolia;
            arr[10] = mockIP11EthereumSepolia;
            arr[11] = mockIP12EthereumSepolia;
            return arr;
        } else if (network == SupportedNetworks.BASE_SEPOLIA) {
            address[] memory arr = new address[](12);
            arr[0] = mockIP1BaseSepolia;
            arr[1] = mockIP2BaseSepolia;
            arr[2] = mockIP3BaseSepolia;
            arr[3] = mockIP4BaseSepolia;
            arr[4] = mockIP5BaseSepolia;
            arr[5] = mockIP6BaseSepolia;
            arr[6] = mockIP7BaseSepolia;
            arr[7] = mockIP8BaseSepolia;
            arr[8] = mockIP9BaseSepolia;
            arr[9] = mockIP10BaseSepolia;
            arr[10] = mockIP11BaseSepolia;
            arr[11] = mockIP12BaseSepolia;
            return arr;
        } else if (network == SupportedNetworks.ARBITRUM_SEPOLIA) {
            address[] memory arr = new address[](12);
            arr[0] = mockIP1ArbitrumSepolia;
            arr[1] = mockIP2ArbitrumSepolia;
            arr[2] = mockIP3ArbitrumSepolia;        
            arr[3] = mockIP4ArbitrumSepolia;
            arr[4] = mockIP5ArbitrumSepolia;
            arr[5] = mockIP6ArbitrumSepolia;
            arr[6] = mockIP7ArbitrumSepolia;    
            arr[7] = mockIP8ArbitrumSepolia;
            arr[8] = mockIP9ArbitrumSepolia;
            arr[9] = mockIP10ArbitrumSepolia;
            arr[10] = mockIP11ArbitrumSepolia;
            arr[11] = mockIP12ArbitrumSepolia;
            return arr;
        } else if (network == SupportedNetworks.AVALANCHE_FUJI) {
            address[] memory arr = new address[](12);
            arr[0] = mockIP1AvalancheFuji;
            arr[1] = mockIP2AvalancheFuji;
            arr[2] = mockIP3AvalancheFuji;
            arr[3] = mockIP4AvalancheFuji;
            arr[4] = mockIP5AvalancheFuji;
            arr[5] = mockIP6AvalancheFuji;
            arr[6] = mockIP7AvalancheFuji;
            arr[7] = mockIP8AvalancheFuji;
            arr[8] = mockIP9AvalancheFuji;
            arr[9] = mockIP10AvalancheFuji;
            arr[10] = mockIP11AvalancheFuji;
            arr[11] = mockIP12AvalancheFuji;
            return arr;
        } else {
            revert("Unsupported network");
        }
    }

    function getNetworkLabel(SupportedNetworks network) internal pure returns (string memory) {
        if (network == SupportedNetworks.ETHEREUM_SEPOLIA) return "Ethereum Sepolia";
        if (network == SupportedNetworks.BASE_SEPOLIA) return "Base Sepolia";
        if (network == SupportedNetworks.ARBITRUM_SEPOLIA) return "Arbitrum Sepolia";
        if (network == SupportedNetworks.AVALANCHE_FUJI) return "Avalanche Fuji";
        return "Unknown";
    }
}
