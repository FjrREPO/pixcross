// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "./Helper.sol";
import {DestinationMinter} from "@nft/DestinationMinter.sol";
import {SourceMinter} from "@nft/SourceMinter.sol";

interface IMockIP {
    function transferOwnership(address newOwner) external;
    function owner() external view returns (address);
}

contract DeployMinterERC721 is Script, Helper {
    struct NFTCollection {
        string name;
        string symbol;
        string baseURI;
    }

    function run(SupportedNetworks destination) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        (address router, , , ) = getConfigFromNetwork(destination);


        address[] memory mockIPs = new address[](12);

        uint length = mockIPs.length;

        DestinationMinter[] memory minters = new DestinationMinter[](length);

        for (uint256 i = 0; i < length; i++) {
            mockIPs[i] = getDummyIPFromNetwork(destination, i + 1);
            

            minters[i] = new DestinationMinter(router, address(mockIPs[i]));

            console.log(
                string.concat("DestinationMinter", vm.toString(i + 1), " deployed on "),
                networks[destination],
                " with address: ",
                address(minters[i])
            );

            IMockIP(mockIPs[i]).transferOwnership(address(minters[i]));

            console.log(
                string.concat("Minter", vm.toString(i + 1), " role granted to: "),
                IMockIP(mockIPs[i]).owner()
            );
            console.log(
                string.concat("DestinationMinter", vm.toString(i + 1), " NFT contract address: "),
                address(mockIPs[i])
            );
        }

        vm.stopBroadcast();
    }
}


contract DeploySource is Script, Helper {
    function run(SupportedNetworks source) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        (address router, address link, , ) = getConfigFromNetwork(source);

        SourceMinter sourceMinter = new SourceMinter(router, link);

        console.log(
            "SourceMinter deployed on ",
            networks[source],
            "with address: ",
            address(sourceMinter)
        );

        vm.stopBroadcast();
    }
}

contract Mint is Script, Helper {
    function run(
        address payable sourceMinterAddress,
        SupportedNetworks destination,
        address destinationMinterAddress,
        SourceMinter.PayFeesIn payFeesIn
    ) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        (, , , uint64 destinationChainId) = getConfigFromNetwork(destination);

        SourceMinter(sourceMinterAddress).mint(
            destinationChainId,
            destinationMinterAddress,
            payFeesIn
        );

        vm.stopBroadcast();
    }
}