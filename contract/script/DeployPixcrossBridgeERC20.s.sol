// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "./Helper.sol";
import {PixcrossBridgeERC20} from "../src/bridge/PixcrossBridgeERC20.sol";
import {IERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";

/**
 * @title PixcrossBridgeERC20 Deployment and Interaction Scripts
 * @notice Scripts to deploy and interact with the PixcrossBridgeERC20 contract
 */

/**
 * @notice Deploy PixcrossBridgeERC20 contract
 */
contract DeployPixcrossBridgeERC20 is Script, Helper {
    address treasury = 0xdd80522DC76eb92e549545563c4247D6976078eD; // Treasury address

    function run(SupportedNetworks network) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        (address router, , , ) = getConfigFromNetwork(network);

        PixcrossBridgeERC20 bridge = new PixcrossBridgeERC20(router, treasury);

        console.log("PixcrossBridgeERC20 deployed at", address(bridge));
        console.log("Router address: ", router);
        console.log("Fee collector: ", treasury);

        vm.stopBroadcast();
    }
}

/**
 * @notice Bridge USDC tokens to another network
 */
contract BridgeUSDC is Script, Helper {
    function run(
        address payable bridgeAddress,
        SupportedNetworks destinationNetwork,
        address receiver,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn
    ) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        _executeBridgeUSDC(bridgeAddress, destinationNetwork, receiver, amount, payFeesIn);

        vm.stopBroadcast();
    }

    function _executeBridgeUSDC(
        address payable bridgeAddress,
        SupportedNetworks destinationNetwork,
        address receiver,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn
    ) private {
        PixcrossBridgeERC20 bridge = PixcrossBridgeERC20(payable(bridgeAddress));
        
        // Get current network and USDC address
        SupportedNetworks currentNetwork = _getCurrentNetwork(bridge);
        address usdcAddress = getDummyUSDCFromNetwork(currentNetwork);

        console.log("Bridging USDC from", networks[currentNetwork], "to", networks[destinationNetwork]);
        console.log("USDC address:", usdcAddress);
        console.log("Amount:", amount);
        console.log("Receiver:", receiver);

        // Check and approve USDC if needed
        _approveTokenIfNeeded(usdcAddress, bridgeAddress, amount);

        // Convert Helper enum to bridge contract enum
        PixcrossBridgeERC20.SupportedNetworks bridgeDestination = _convertToBridgeNetwork(destinationNetwork);

        // Get estimated fees and execute bridge
        _getBridgeFeesAndExecute(
            bridge,
            bridgeDestination,
            receiver,
            PixcrossBridgeERC20.SupportedToken.USDC,
            amount,
            payFeesIn
        );
    }

    function _approveTokenIfNeeded(address tokenAddress, address spender, uint256 amount) private {
        IERC20 token = IERC20(tokenAddress);
        if (token.allowance(msg.sender, spender) < amount) {
            console.log("Approving token...");
            token.approve(spender, amount);
        }
    }

    function _getBridgeFeesAndExecute(
        PixcrossBridgeERC20 bridge,
        PixcrossBridgeERC20.SupportedNetworks destination,
        address receiver,
        PixcrossBridgeERC20.SupportedToken token,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn
    ) private {
        (uint256 ccipFee, uint256 bridgeFee, uint256 totalAmount) = bridge.getEstimatedFees(
            destination,
            token,
            amount,
            payFeesIn
        );

        console.log("CCIP Fee:", ccipFee);
        console.log("Bridge Fee:", bridgeFee);
        console.log("Total Amount:", totalAmount);

        bytes32 messageId = _executeBridge(bridge, destination, receiver, token, amount, payFeesIn, ccipFee);
        console.log("Bridge transaction sent with message ID:");
        console.logBytes32(messageId);
    }

    function _getCurrentNetwork(
        PixcrossBridgeERC20 bridge
    ) private view returns (SupportedNetworks) {
        address router = bridge.getRouter();

        if (router == 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59) {
            return SupportedNetworks.ETHEREUM_SEPOLIA;
        } else if (router == 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93) {
            return SupportedNetworks.BASE_SEPOLIA;
        } else if (router == 0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165) {
            return SupportedNetworks.ARBITRUM_SEPOLIA;
        } else if (router == 0xF694E193200268f9a4868e4Aa017A0118C9a8177) {
            return SupportedNetworks.AVALANCHE_FUJI;
        }

        revert("Unsupported network");
    }

    function _convertToBridgeNetwork(
        SupportedNetworks helperNetwork
    ) private pure returns (PixcrossBridgeERC20.SupportedNetworks) {
        if (helperNetwork == SupportedNetworks.ETHEREUM_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.ETHEREUM_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.BASE_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.BASE_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.ARBITRUM_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.ARBITRUM_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.AVALANCHE_FUJI) {
            return PixcrossBridgeERC20.SupportedNetworks.AVALANCHE_FUJI;
        }
        revert("Unsupported helper network");
    }

    function _executeBridge(
        PixcrossBridgeERC20 bridge,
        PixcrossBridgeERC20.SupportedNetworks destination,
        address receiver,
        PixcrossBridgeERC20.SupportedToken token,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn,
        uint256 ccipFee
    ) private returns (bytes32) {
        if (payFeesIn == PixcrossBridgeERC20.PayFeesIn.Native) {
            return bridge.bridgeTokens{value: ccipFee}(
                destination,
                receiver,
                token,
                amount,
                payFeesIn
            );
        } else {
            return bridge.bridgeTokens(
                destination,
                receiver,
                token,
                amount,
                payFeesIn
            );
        }
    }
}

/**
 * @notice Bridge USDT tokens to another network
 */
contract BridgeUSDT is Script, Helper {
    function run(
        address payable bridgeAddress,
        SupportedNetworks destinationNetwork,
        address receiver,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn
    ) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        _executeBridgeUSDT(bridgeAddress, destinationNetwork, receiver, amount, payFeesIn);

        vm.stopBroadcast();
    }

    function _executeBridgeUSDT(
        address payable bridgeAddress,
        SupportedNetworks destinationNetwork,
        address receiver,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn
    ) private {
        PixcrossBridgeERC20 bridge = PixcrossBridgeERC20(payable(bridgeAddress));
        
        // Get current network and USDT address
        SupportedNetworks currentNetwork = _getCurrentNetwork(bridge);
        address usdtAddress = getDummyUSDTFromNetwork(currentNetwork);

        console.log("Bridging USDT from", networks[currentNetwork], "to", networks[destinationNetwork]);
        console.log("USDT address:", usdtAddress);
        console.log("Amount:", amount);
        console.log("Receiver:", receiver);

        // Check and approve USDT if needed
        _approveTokenIfNeeded(usdtAddress, bridgeAddress, amount);

        // Convert Helper enum to bridge contract enum
        PixcrossBridgeERC20.SupportedNetworks bridgeDestination = _convertToBridgeNetwork(destinationNetwork);

        // Get estimated fees and execute bridge
        _getBridgeFeesAndExecute(
            bridge,
            bridgeDestination,
            receiver,
            PixcrossBridgeERC20.SupportedToken.USDT,
            amount,
            payFeesIn
        );
    }

    function _approveTokenIfNeeded(address tokenAddress, address spender, uint256 amount) private {
        IERC20 token = IERC20(tokenAddress);
        if (token.allowance(msg.sender, spender) < amount) {
            console.log("Approving token...");
            token.approve(spender, amount);
        }
    }

    function _getBridgeFeesAndExecute(
        PixcrossBridgeERC20 bridge,
        PixcrossBridgeERC20.SupportedNetworks destination,
        address receiver,
        PixcrossBridgeERC20.SupportedToken token,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn
    ) private {
        (uint256 ccipFee, uint256 bridgeFee, uint256 totalAmount) = bridge.getEstimatedFees(
            destination,
            token,
            amount,
            payFeesIn
        );

        console.log("CCIP Fee:", ccipFee);
        console.log("Bridge Fee:", bridgeFee);
        console.log("Total Amount:", totalAmount);

        bytes32 messageId = _executeBridge(bridge, destination, receiver, token, amount, payFeesIn, ccipFee);
        console.log("Bridge transaction sent with message ID:");
        console.logBytes32(messageId);
    }

    function _getCurrentNetwork(
        PixcrossBridgeERC20 bridge
    ) private view returns (SupportedNetworks) {
        address router = bridge.getRouter();

        if (router == 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59) {
            return SupportedNetworks.ETHEREUM_SEPOLIA;
        } else if (router == 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93) {
            return SupportedNetworks.BASE_SEPOLIA;
        } else if (router == 0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165) {
            return SupportedNetworks.ARBITRUM_SEPOLIA;
        } else if (router == 0xF694E193200268f9a4868e4Aa017A0118C9a8177) {
            return SupportedNetworks.AVALANCHE_FUJI;
        }

        revert("Unsupported network");
    }

    function _convertToBridgeNetwork(
        SupportedNetworks helperNetwork
    ) private pure returns (PixcrossBridgeERC20.SupportedNetworks) {
        if (helperNetwork == SupportedNetworks.ETHEREUM_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.ETHEREUM_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.BASE_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.BASE_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.ARBITRUM_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.ARBITRUM_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.AVALANCHE_FUJI) {
            return PixcrossBridgeERC20.SupportedNetworks.AVALANCHE_FUJI;
        }
        revert("Unsupported helper network");
    }

    function _executeBridge(
        PixcrossBridgeERC20 bridge,
        PixcrossBridgeERC20.SupportedNetworks destination,
        address receiver,
        PixcrossBridgeERC20.SupportedToken token,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn,
        uint256 ccipFee
    ) private returns (bytes32) {
        if (payFeesIn == PixcrossBridgeERC20.PayFeesIn.Native) {
            return bridge.bridgeTokens{value: ccipFee}(
                destination,
                receiver,
                token,
                amount,
                payFeesIn
            );
        } else {
            return bridge.bridgeTokens(
                destination,
                receiver,
                token,
                amount,
                payFeesIn
            );
        }
    }


}

/**
 * @notice Bridge IDRX tokens to another network
 */
contract BridgeIDRX is Script, Helper {
    function run(
        address payable bridgeAddress,
        SupportedNetworks destinationNetwork,
        address receiver,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn
    ) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        _executeBridgeIDRX(bridgeAddress, destinationNetwork, receiver, amount, payFeesIn);

        vm.stopBroadcast();
    }

    function _executeBridgeIDRX(
        address payable bridgeAddress,
        SupportedNetworks destinationNetwork,
        address receiver,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn
    ) private {
        PixcrossBridgeERC20 bridge = PixcrossBridgeERC20(payable(bridgeAddress));
        
        // Get current network and IDRX address
        SupportedNetworks currentNetwork = _getCurrentNetwork(bridge);
        address idrxAddress = getDummyIDRXFromNetwork(currentNetwork);

        console.log("Bridging IDRX from", networks[currentNetwork], "to", networks[destinationNetwork]);
        console.log("IDRX address:", idrxAddress);
        console.log("Amount:", amount);
        console.log("Receiver:", receiver);

        // Check and approve IDRX if needed
        _approveTokenIfNeeded(idrxAddress, bridgeAddress, amount);

        // Convert Helper enum to bridge contract enum
        PixcrossBridgeERC20.SupportedNetworks bridgeDestination = _convertToBridgeNetwork(destinationNetwork);

        // Get estimated fees and execute bridge
        _getBridgeFeesAndExecute(
            bridge,
            bridgeDestination,
            receiver,
            PixcrossBridgeERC20.SupportedToken.IDRX,
            amount,
            payFeesIn
        );
    }

    function _approveTokenIfNeeded(address tokenAddress, address spender, uint256 amount) private {
        IERC20 token = IERC20(tokenAddress);
        if (token.allowance(msg.sender, spender) < amount) {
            console.log("Approving token...");
            token.approve(spender, amount);
        }
    }

    function _getBridgeFeesAndExecute(
        PixcrossBridgeERC20 bridge,
        PixcrossBridgeERC20.SupportedNetworks destination,
        address receiver,
        PixcrossBridgeERC20.SupportedToken token,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn
    ) private {
        (uint256 ccipFee, uint256 bridgeFee, uint256 totalAmount) = bridge.getEstimatedFees(
            destination,
            token,
            amount,
            payFeesIn
        );

        console.log("CCIP Fee:", ccipFee);
        console.log("Bridge Fee:", bridgeFee);
        console.log("Total Amount:", totalAmount);

        bytes32 messageId = _executeBridge(bridge, destination, receiver, token, amount, payFeesIn, ccipFee);
        console.log("Bridge transaction sent with message ID:");
        console.logBytes32(messageId);
    }

    function _getCurrentNetwork(
        PixcrossBridgeERC20 bridge
    ) private view returns (SupportedNetworks) {
        address router = bridge.getRouter();

        if (router == 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59) {
            return SupportedNetworks.ETHEREUM_SEPOLIA;
        } else if (router == 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93) {
            return SupportedNetworks.BASE_SEPOLIA;
        } else if (router == 0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165) {
            return SupportedNetworks.ARBITRUM_SEPOLIA;
        } else if (router == 0xF694E193200268f9a4868e4Aa017A0118C9a8177) {
            return SupportedNetworks.AVALANCHE_FUJI;
        }

        revert("Unsupported network");
    }

    function _convertToBridgeNetwork(
        SupportedNetworks helperNetwork
    ) private pure returns (PixcrossBridgeERC20.SupportedNetworks) {
        if (helperNetwork == SupportedNetworks.ETHEREUM_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.ETHEREUM_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.BASE_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.BASE_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.ARBITRUM_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.ARBITRUM_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.AVALANCHE_FUJI) {
            return PixcrossBridgeERC20.SupportedNetworks.AVALANCHE_FUJI;
        }
        revert("Unsupported helper network");
    }

    function _executeBridge(
        PixcrossBridgeERC20 bridge,
        PixcrossBridgeERC20.SupportedNetworks destination,
        address receiver,
        PixcrossBridgeERC20.SupportedToken token,
        uint256 amount,
        PixcrossBridgeERC20.PayFeesIn payFeesIn,
        uint256 ccipFee
    ) private returns (bytes32) {
        if (payFeesIn == PixcrossBridgeERC20.PayFeesIn.Native) {
            return bridge.bridgeTokens{value: ccipFee}(
                destination,
                receiver,
                token,
                amount,
                payFeesIn
            );
        } else {
            return bridge.bridgeTokens(
                destination,
                receiver,
                token,
                amount,
                payFeesIn
            );
        }
    }


}

/**
 * @notice Fund bridge contract with native tokens for fees
 */
contract FundBridge is Script {
    function run(address payable bridgeAddress, uint256 amount) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        console.log("Funding bridge with", amount, "wei");

        (bool success, ) = bridgeAddress.call{value: amount}("");
        require(success, "Failed to fund bridge");

        console.log("Bridge funded successfully");
        console.log("Bridge balance:", bridgeAddress.balance);

        vm.stopBroadcast();
    }
}

/**
 * @notice Fund bridge contract with LINK tokens for fees
 */
contract FundBridgeWithLINK is Script, Helper {
    function run(
        SupportedNetworks network,
        address bridgeAddress,
        uint256 amount
    ) external {
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        (, address linkToken, , ) = getConfigFromNetwork(network);

        console.log("Funding bridge with", amount, "LINK tokens");
        console.log("LINK token address:", linkToken);

        IERC20(linkToken).transfer(bridgeAddress, amount);

        console.log("Bridge funded with LINK successfully");
        console.log(
            "Bridge LINK balance:",
            IERC20(linkToken).balanceOf(bridgeAddress)
        );

        vm.stopBroadcast();
    }
}

/**
 * @notice Get estimated fees for bridging
 */
contract GetEstimatedFees is Script, Helper {
    function run(
        address bridgeAddress,
        SupportedNetworks destinationNetwork,
        uint8 tokenType, // 0 = USDC, 1 = USDT
        uint256 amount,
        uint8 payFeesIn // 0 = Native, 1 = LINK
    ) external view {
        PixcrossBridgeERC20 bridge = PixcrossBridgeERC20(
            payable(bridgeAddress)
        );

        PixcrossBridgeERC20.SupportedToken token = tokenType == 0
            ? PixcrossBridgeERC20.SupportedToken.USDC
            : PixcrossBridgeERC20.SupportedToken.USDT;

        PixcrossBridgeERC20.PayFeesIn feePayment = payFeesIn == 0
            ? PixcrossBridgeERC20.PayFeesIn.Native
            : PixcrossBridgeERC20.PayFeesIn.LINK;

        PixcrossBridgeERC20.SupportedNetworks bridgeDestination = _convertToBridgeNetwork(
                destinationNetwork
            );

        (uint256 ccipFee, uint256 bridgeFee, uint256 totalAmount) = bridge
            .getEstimatedFees(bridgeDestination, token, amount, feePayment);

        console.log("=== Fee Estimation ===");
        console.log("Token:", tokenType == 0 ? "USDC" : "USDT");
        console.log("Amount:", amount);
        console.log("Destination:", networks[destinationNetwork]);
        console.log("Pay fees in:", payFeesIn == 0 ? "Native" : "LINK");
        console.log("CCIP Fee:", ccipFee);
        console.log("Bridge Fee:", bridgeFee);
        console.log("Total Amount Needed:", totalAmount);
    }

    function _convertToBridgeNetwork(
        SupportedNetworks helperNetwork
    ) private pure returns (PixcrossBridgeERC20.SupportedNetworks) {
        if (helperNetwork == SupportedNetworks.ETHEREUM_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.ETHEREUM_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.BASE_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.BASE_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.ARBITRUM_SEPOLIA) {
            return PixcrossBridgeERC20.SupportedNetworks.ARBITRUM_SEPOLIA;
        } else if (helperNetwork == SupportedNetworks.AVALANCHE_FUJI) {
            return PixcrossBridgeERC20.SupportedNetworks.AVALANCHE_FUJI;
        }
        revert("Unsupported helper network");
    }
}

/**
 * @notice Check bridge contract status and balances
 */
contract CheckBridgeStatus is Script, Helper {
    function run(
        address bridgeAddress,
        SupportedNetworks network
    ) external view {
        PixcrossBridgeERC20 bridge = PixcrossBridgeERC20(
            payable(bridgeAddress)
        );

        console.log("=== Bridge Status ===");
        console.log("Bridge address:", bridgeAddress);
        console.log("Network:", networks[network]);
        console.log("Paused:", bridge.paused());
        console.log("Owner:", bridge.owner());
        console.log("Fee collector:", bridge.feeCollector());
        console.log(
            "Bridge fee percent (basis points):",
            bridge.bridgeFeePercent()
        );
        console.log("Native balance:", bridgeAddress.balance);

        // Check LINK balance
        (, address linkToken, , ) = getConfigFromNetwork(network);
        console.log(
            "LINK balance:",
            IERC20(linkToken).balanceOf(bridgeAddress)
        );

        // Check USDC balance
        address usdcAddress = getDummyUSDCFromNetwork(network);
        console.log(
            "USDC balance:",
            IERC20(usdcAddress).balanceOf(bridgeAddress)
        );

        // Check USDT balance
        address usdtAddress = getDummyUSDTFromNetwork(network);
        console.log(
            "USDT balance:",
            IERC20(usdtAddress).balanceOf(bridgeAddress)
        );

        // Check transfer limits
        console.log("=== Transfer Limits ===");
        console.log(
            "USDC min:",
            bridge.minTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDC)
        );
        console.log(
            "USDC max:",
            bridge.maxTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDC)
        );
        console.log(
            "USDT min:",
            bridge.minTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDT)
        );
        console.log(
            "USDT max:",
            bridge.maxTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDT)
        );
    }
}
