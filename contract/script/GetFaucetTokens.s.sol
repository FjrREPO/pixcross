// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "./Helper.sol";

interface IERC20Drip {
    function drip(address to) external;

    function mint(address to, uint256 amount) external;

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function symbol() external view returns (string memory);
}

/**
 * @title GetFaucetTokens
 * @dev Script to get USDC and USDT tokens from testnet faucets
 *
 * Usage:
 * forge script script/GetFaucetTokens.s.sol --rpc-url sepolia --broadcast
 *
 * Or for specific network:
 * forge script script/GetFaucetTokens.s.sol:GetFaucetTokens --sig "run(uint8)" 0 --rpc-url sepolia --broadcast
 *
 * Network IDs:
 * 0 = Ethereum Sepolia
 * 1 = Base Sepolia
 * 2 = Arbitrum Sepolia
 * 3 = Avalanche Fuji
 */
contract GetFaucetTokens is Script, Helper {
    function run() external {
        // Default to Ethereum Sepolia if no network specified
        run(uint8(SupportedNetworks.ETHEREUM_SEPOLIA));
    }

    function run(uint8 networkId) public {
        require(networkId <= 3, "Invalid network ID");

        SupportedNetworks network = SupportedNetworks(networkId);
        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        address senderAddress = vm.addr(senderPrivateKey);

        console.log("Getting tokens on", networks[network]);
        console.log("Recipient address:", senderAddress);

        vm.startBroadcast(senderPrivateKey);

        // Get USDC and USDT addresses
        address usdc = getDummyUSDCFromNetwork(network);
        address usdt = getDummyUSDTFromNetwork(network);
        address idrx = getDummyIDRXFromNetwork(network);

        console.log("\nAttempting to get tokens...");

        // Try to get USDC (uses mint function)
        if (usdc != address(0)) {
            _attemptTokenMint(usdc, senderAddress, "USDC");
        } else {
            console.log("USDC not available on this network");
        }

        // Try to get USDT (uses mint function)
        if (usdt != address(0)) {
            _attemptTokenMint(usdt, senderAddress, "USDT");
        } else {
            console.log("USDT not available on this network");
        }

        // Try to get IDRX (uses mint function)
        if (idrx != address(0)) {
            _attemptTokenMint(idrx, senderAddress, "IDRX");
        } else {
            console.log("IDRX not available on this network");
        }

        // Also get some dummy CCIP tokens (uses drip function)
        // (address ccipBnM, address ccipLnM) = getDummyTokensFromNetwork(network);

        // if (ccipBnM != address(0)) {
        //     _attemptTokenDrip(ccipBnM, senderAddress, "CCIP-BnM");
        // }

        // if (ccipLnM != address(0)) {
        //     _attemptTokenDrip(ccipLnM, senderAddress, "CCIP-LnM");
        // }

        vm.stopBroadcast();

        // Display final balances
        // _displayBalances(senderAddress, usdc, usdt, ccipBnM, ccipLnM);
    }

    function _attemptTokenMint(
        address tokenAddress,
        address recipient,
        string memory tokenName
    ) internal {
        console.log("\nAttempting to mint", tokenName, "tokens...");
        console.log("Token address:", tokenAddress);

        IERC20Drip token = IERC20Drip(tokenAddress);

        // Check initial balance
        uint256 initialBalance = token.balanceOf(recipient);
        console.log("Initial balance:", initialBalance / 10 ** 18, tokenName);

        // Mint tokens (USDC/USDT use mint with amount parameter)
        uint256 mintAmount = 1_000_000_000_000 * 10 ** 18; // 1,000,000,000,000 tokens
        try token.mint(recipient, mintAmount) {
            console.log(
                "Successfully minted",
                mintAmount / 10 ** 18,
                tokenName,
                "tokens"
            );
        } catch {
            console.log("mint() failed for", tokenName);
            console.log("Manual token acquisition may be required");
        }

        // Check final balance
        uint256 finalBalance = token.balanceOf(recipient);
        uint256 received = finalBalance - initialBalance;

        if (received > 0) {
            console.log("Received:", received / 10 ** 18, tokenName);
            console.log("New balance:", finalBalance / 10 ** 18, tokenName);
        } else {
            console.log("No new", tokenName, "tokens received");
        }
    }

    function _attemptTokenDrip(
        address tokenAddress,
        address recipient,
        string memory tokenName
    ) internal {
        console.log("\nAttempting to drip", tokenName, "tokens...");
        console.log("Token address:", tokenAddress);

        IERC20Drip token = IERC20Drip(tokenAddress);

        // Check initial balance
        uint256 initialBalance = token.balanceOf(recipient);
        console.log("Initial balance:", initialBalance / 10 ** 18, tokenName);

        // Try drip function (CCIP tokens use drip without parameters)
        try token.drip(recipient) {
            console.log("Successfully called drip() for", tokenName);
        } catch {
            console.log("drip() failed for", tokenName);
            console.log("Manual token acquisition may be required");
        }

        // Check final balance
        uint256 finalBalance = token.balanceOf(recipient);
        uint256 received = finalBalance - initialBalance;

        if (received > 0) {
            console.log("Received:", received / 10 ** 18, tokenName);
            console.log("New balance:", finalBalance / 10 ** 18, tokenName);
        } else {
            console.log("No new", tokenName, "tokens received");
        }
    }

    function _displayBalances(
        address account,
        address usdc,
        address usdt,
        address idrx,
        address ccipBnM,
        address ccipLnM
    ) internal view {
        console.log("\n=== FINAL TOKEN BALANCES ===");
        console.log("Account:", account);

        if (usdc != address(0)) {
            uint256 usdcBalance = IERC20Drip(usdc).balanceOf(account);
            console.log("USDC:", usdcBalance / 10 ** 18, "tokens");
        }

        if (usdt != address(0)) {
            uint256 usdtBalance = IERC20Drip(usdt).balanceOf(account);
            console.log("USDT:", usdtBalance / 10 ** 18, "tokens");
        }

        if (idrx != address(0)) {
            uint256 idrxBalance = IERC20Drip(idrx).balanceOf(account);
            console.log("IDRX:", idrxBalance / 10 ** 18, "tokens");
        }

        if (ccipBnM != address(0)) {
            uint256 ccipBnMBalance = IERC20Drip(ccipBnM).balanceOf(account);
            console.log("CCIP-BnM:", ccipBnMBalance / 10 ** 18, "tokens");
        }

        if (ccipLnM != address(0)) {
            uint256 ccipLnMBalance = IERC20Drip(ccipLnM).balanceOf(account);
            console.log("CCIP-LnM:", ccipLnMBalance / 10 ** 18, "tokens");
        }

        console.log("\n=== NEXT STEPS ===");
        console.log("To supply tokens to PixcrossFaucet:");
        console.log(
            "1. Deploy PixcrossFaucet using DeployPixcrossFaucet.s.sol"
        );
        console.log("2. Approve PixcrossFaucet to spend your tokens");
        console.log("3. Call supplyTokens(tokenAddress, amount) on the faucet");
    }

    /**
     * @dev Transfer tokens to a specific address (useful for funding faucets)
     */
    function transferTokens(
        uint8 networkId,
        address tokenAddress,
        address recipient,
        uint256 amount
    ) external {
        require(networkId <= 3, "Invalid network ID");

        uint256 senderPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(senderPrivateKey);

        IERC20Drip token = IERC20Drip(tokenAddress);
        bool success = token.transfer(recipient, amount);

        if (success) {
            console.log(
                "Successfully transferred",
                amount / 10 ** 18,
                "tokens to",
                recipient
            );
        } else {
            console.log("Transfer failed");
        }

        vm.stopBroadcast();
    }
}
