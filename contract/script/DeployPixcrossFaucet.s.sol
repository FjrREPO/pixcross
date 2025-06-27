// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "./Helper.sol";
import "../src/core/PixcrossFaucet.sol";

interface IERC20Faucet {
    function mint(address to, uint256 amount) external;

    function drip(address to) external;

    function transfer(address to, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);
}

/**
 * @title DeployPixcrossFaucet
 * @dev Script to deploy PixcrossFaucet contract and configure it with USDC and USDT
 *
 * Usage:
 * forge script script/DeployPixcrossFaucet.s.sol --rpc-url <network_rpc> --broadcast --verify
 *
 * Or for specific network:
 * forge script script/DeployPixcrossFaucet.s.sol:DeployPixcrossFaucet --sig "run(uint8)" 0 --rpc-url sepolia --broadcast
 *
 * Network IDs:
 * 0 = Ethereum Sepolia
 * 1 = Base Sepolia
 * 2 = Arbitrum Sepolia
 * 3 = Avalanche Fuji
 */
contract DeployPixcrossFaucet is Script, Helper {
    // Faucet configuration
    uint256 constant DEFAULT_FAUCET_LIMIT = 10_000 * 10 ** 18; // 100 tokens
    uint256 constant DEFAULT_COOLDOWN = 1 hours;
    uint256 constant INITIAL_SUPPLY_AMOUNT = 1_000_000_000 * 10 ** 18; // 1M tokens
    uint256 constant DRIP_AMOUNT = 999_990_000 * 10 ** 18; // 999_990_000 tokens per drip (half of what we mint)

    PixcrossFaucet public faucet;

    function run() external {
        // Default to Ethereum Sepolia if no network specified
        run(uint8(SupportedNetworks.ETHEREUM_SEPOLIA));
    }

    function run(uint8 networkId) public {
        require(networkId <= 3, "Invalid network ID");

        SupportedNetworks network = SupportedNetworks(networkId);
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying PixcrossFaucet on", networks[network]);
        console.log("Deployer address:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy PixcrossFaucet
        faucet = new PixcrossFaucet();
        console.log("PixcrossFaucet deployed at:", address(faucet));

        // Get network token addresses
        address usdc = getDummyUSDCFromNetwork(network);
        address usdt = getDummyUSDTFromNetwork(network);
        address idrx = getDummyIDRXFromNetwork(network);

        console.log("USDC address:", usdc);
        console.log("USDT address:", usdt);
        console.log("IDRX address:", idrx);

        // Configure tokens with custom limits
        if (usdc != address(0)) {
            faucet.addToken(usdc, DEFAULT_FAUCET_LIMIT);
            console.log("Added USDC to faucet with limit: 10000 tokens");
        }

        if (usdt != address(0)) {
            faucet.addToken(usdt, DEFAULT_FAUCET_LIMIT);
            console.log("Added USDT to faucet with limit: 10000 tokens");
        }

        if (idrx != address(0)) {
            faucet.addToken(idrx, DEFAULT_FAUCET_LIMIT);
            console.log("Added IDRX to faucet with limit: 10000 tokens");
        }

        // Try to get some tokens for the faucet
        _supplyFaucetTokens(network, usdc, usdt, idrx, deployer);

        vm.stopBroadcast();

        // Display deployment info
        _displayDeploymentInfo(network, usdc, usdt, idrx);
    }

    /**
     * @dev Attempt to supply tokens to the faucet by minting from testnet faucets
     */
    function _supplyFaucetTokens(
        SupportedNetworks /* network */,
        address usdc,
        address usdt,
        address idrx,
        address deployer
    ) internal {
        console.log("\n=== Attempting to supply faucet with tokens ===");

        // Try to mint USDC
        if (usdc != address(0)) {
            // Check balance and supply to faucet
            uint256 usdcBalance = IERC20Faucet(usdc).balanceOf(deployer);
            if (usdcBalance < DRIP_AMOUNT) {
                try IERC20Faucet(usdc).mint(deployer, INITIAL_SUPPLY_AMOUNT) {
                    console.log("Minted 1000000 USDC to deployer");
                    // Refresh balance after minting
                    usdcBalance = IERC20Faucet(usdc).balanceOf(deployer);
                } catch {
                    console.log("Failed to mint USDC");
                }
            } else {
                console.log("Deployer already has sufficient USDC balance");
            }
            if (usdcBalance >= DRIP_AMOUNT) {
                try IERC20Faucet(usdc).approve(address(faucet), DRIP_AMOUNT) {
                    try faucet.supplyTokens(usdc, DRIP_AMOUNT) {
                        console.log("Supplied USDC to faucet");
                    } catch {
                        console.log("Failed to supply USDC to faucet");
                    }
                } catch {
                    console.log("Failed to approve USDC transfer");
                }
            } else {
                console.log("Insufficient USDC balance after mint");
            }
        }

        // Try to mint USDT
        if (usdt != address(0)) {
            // Check balance and supply to faucet
            uint256 usdtBalance = IERC20Faucet(usdt).balanceOf(deployer);
            if (usdtBalance < DRIP_AMOUNT) {
                try IERC20Faucet(usdt).mint(deployer, INITIAL_SUPPLY_AMOUNT) {
                    console.log("Minted 1000000 USDT to deployer");
                    // Refresh balance after minting
                    usdtBalance = IERC20Faucet(usdt).balanceOf(deployer);
                } catch {
                    console.log("Failed to mint USDT");
                }
            } else {
                console.log("Deployer already has sufficient USDT balance");
            }
            if (usdtBalance >= DRIP_AMOUNT) {
                try IERC20Faucet(usdt).approve(address(faucet), DRIP_AMOUNT) {
                    try faucet.supplyTokens(usdt, DRIP_AMOUNT) {
                        console.log("Supplied USDT to faucet");
                    } catch {
                        console.log("Failed to supply USDT to faucet");
                    }
                } catch {
                    console.log("Failed to approve USDT transfer");
                }
            } else {
                console.log("Insufficient USDT balance after mint");
            }
        }

        // Try to mint IDRX
        if (idrx != address(0)) {
            // Check balance and supply to faucet - handle potential revert for IDRX
            try IERC20Faucet(idrx).balanceOf(deployer) returns (uint256 idrxBalance) {
                if (idrxBalance < DRIP_AMOUNT) {
                    try IERC20Faucet(idrx).mint(deployer, INITIAL_SUPPLY_AMOUNT) {
                        console.log("Minted 1000000 IDRX to deployer");
                        // Refresh balance after minting
                        try IERC20Faucet(idrx).balanceOf(deployer) returns (uint256 newBalance) {
                            idrxBalance = newBalance;
                        } catch {
                            console.log("Failed to check IDRX balance after mint");
                        }
                    } catch {
                        console.log("Failed to mint IDRX");
                    }
                } else {
                    console.log("Deployer already has sufficient IDRX balance");
                }
                if (idrxBalance >= DRIP_AMOUNT) {
                    try IERC20Faucet(idrx).approve(address(faucet), DRIP_AMOUNT) {
                        try faucet.supplyTokens(idrx, DRIP_AMOUNT) {
                            console.log("Supplied IDRX to faucet");
                        } catch {
                            console.log("Failed to supply IDRX to faucet");
                        }
                    } catch {
                        console.log("Failed to approve IDRX transfer");
                    }
                } else {
                    console.log("Insufficient IDRX balance after mint");
                }
            } catch {
                console.log("IDRX token not accessible or balance check failed");
            }
        }
        console.log("Faucet supply attempt complete.");
        console.log(
            "You can now use the faucet to claim tokens. Check the deployment summary above."
        );
        console.log("Remember to approve the faucet to spend your tokens first.");
        console.log("You can also use the helper functions to supply tokens.");
        console.log("To claim tokens, use the claimTokens function with your wallet address.");
        console.log("Happy claiming!");
        console.log("=========================================");
    }

    /**
     * @dev Display comprehensive deployment information
     */
    function _displayDeploymentInfo(
        SupportedNetworks network,
        address usdc,
        address usdt,
        address idrx
    ) internal view {
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network:", networks[network]);
        console.log("PixcrossFaucet:", address(faucet));
        console.log("Owner:", faucet.owner());
        console.log(
            "Default Cooldown:",
            faucet.cooldownPeriod() / 3600,
            "hours"
        );
        console.log(
            "Default Faucet Limit:",
            faucet.defaultFaucetLimit() / 10 ** 18,
            "tokens"
        );

        console.log("\n=== SUPPORTED TOKENS ===");
        address[] memory supportedTokens = faucet.getSupportedTokens();
        console.log("Total supported tokens:", supportedTokens.length);

        for (uint i = 0; i < supportedTokens.length; i++) {
            address token = supportedTokens[i];
            PixcrossFaucet.TokenInfo memory info = faucet.getTokenInfo(token);

            string memory tokenName = "Unknown";
            if (token == usdc) tokenName = "USDC";
            else if (token == usdt) tokenName = "USDT";
            else if (token == idrx) tokenName = "IDRX";

            console.log("\nToken:", tokenName);
            console.log("  Address:", token);
            console.log("  Balance:", info.balance / 10 ** 18, "tokens");
            console.log("  Limit:", info.faucetLimit / 10 ** 18, "tokens");
            console.log("  Active:", info.isActive);
        }

        console.log("\n=== USAGE INSTRUCTIONS ===");
        console.log("To claim tokens from the faucet:");
        console.log(
            "1. Call claimTokens(tokenAddress, receiverAddress, amount)"
        );
        console.log(
            "2. Amount must be <= faucet limit (",
            DEFAULT_FAUCET_LIMIT / 10 ** 18,
            "tokens)"
        );
        console.log(
            "3. Must wait",
            DEFAULT_COOLDOWN / 3600,
            "hours between claims"
        );

        console.log("\nTo supply more tokens to the faucet:");
        console.log("1. Approve faucet to spend your tokens");
        console.log("2. Call supplyTokens(tokenAddress, amount)");

        console.log("\n=== ADMIN FUNCTIONS ===");
        console.log("Only owner can:");
        console.log("- addToken(address, faucetLimit)");
        console.log("- setFaucetLimit(address, newLimit)");
        console.log("- setTokenActive(address, isActive)");
        console.log("- setCooldownPeriod(newCooldown)");
        console.log("- emergencyWithdraw(token, amount, recipient)");
        console.log("- pause() / unpause()");
    }

    /**
     * @dev Helper function to supply tokens manually after deployment
     */
    function supplyTokens(
        uint8 networkId,
        address faucetAddress,
        address tokenAddress,
        uint256 amount
    ) external {
        require(networkId <= 3, "Invalid network ID");

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        PixcrossFaucet targetFaucet = PixcrossFaucet(faucetAddress);
        targetFaucet.supplyTokens(tokenAddress, amount);

        console.log("Supplied", amount / 10 ** 18, "tokens to faucet");

        vm.stopBroadcast();
    }

    /**
     * @dev Helper function to claim tokens from deployed faucet
     */
    function claimTokens(
        address faucetAddress,
        address tokenAddress,
        address receiver,
        uint256 amount
    ) external {
        uint256 userPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(userPrivateKey);

        PixcrossFaucet targetFaucet = PixcrossFaucet(faucetAddress);

        // Check if can claim
        (bool canClaim, string memory reason) = targetFaucet.canClaim(
            vm.addr(userPrivateKey),
            tokenAddress,
            amount
        );

        if (!canClaim) {
            console.log("Cannot claim:", reason);
            vm.stopBroadcast();
            return;
        }

        targetFaucet.claimTokens(tokenAddress, receiver, amount);
        console.log("Successfully claimed", amount / 10 ** 18, "tokens");

        vm.stopBroadcast();
    }
}
