// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "./Helper.sol";
import {Script, console} from "forge-std/Script.sol";
import {IPixcross, Id, Pool, Position, PoolParams} from "@interfaces/IPixcross.sol";
import {Pixcross} from "@core/Pixcross.sol";
import {MockIrm} from "@mocks/MockIrm.sol";
import {MockOracle} from "@mocks/MockOracle.sol";

import {PixcrossCuratorFactory} from "@factories/PixcrossCuratorFactory.sol";
import {PixcrossCurator} from "@core/PixcrossCurator.sol";

contract DeployPixcrossScript is Script, Helper {
    function run(SupportedNetworks network) external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        Pixcross pixcross = new Pixcross();
        PixcrossCuratorFactory pixcrossCuratorFactory = new PixcrossCuratorFactory(address(pixcross));

        address usdc = getDummyUSDCFromNetwork(network);
        address usdt = getDummyUSDTFromNetwork(network);
        address idrx = getDummyIDRXFromNetwork(network);

        address[] memory mockIP = getNFTsByNetwork(network);

        if (network == SupportedNetworks.ETHEREUM_SEPOLIA) {
            // Fixed: Use proper per-second rates
            uint256 secondsPerYear = 31536000; // 365 * 24 * 3600
            MockIrm irm1 = new MockIrm(5e16 / secondsPerYear);  // 5% annual
            MockIrm irm2 = new MockIrm(1e17 / secondsPerYear);  // 10% annual  
            MockIrm irm3 = new MockIrm(2e17 / secondsPerYear);  // 20% annual

            MockOracle oracle1 = new MockOracle(1500e18);
            MockOracle oracle2 = new MockOracle(2000e18);
            MockOracle oracle3 = new MockOracle(2500e18);

            pixcross.setInterestRateModel(address(irm1), true);
            pixcross.setInterestRateModel(address(irm2), true);
            pixcross.setInterestRateModel(address(irm3), true);
            pixcross.setLTV(85, true);
            pixcross.setLTV(80, true);
            pixcross.setLTV(75, true);

            PoolParams memory poolParams = PoolParams({
                collateralToken: mockIP[0],
                loanToken: usdc,
                oracle: address(oracle1),
                irm: address(irm1),
                ltv: 85,
                lth: 90
            });

            pixcross.createPool(poolParams);

            poolParams = PoolParams({
                collateralToken: mockIP[1],
                loanToken: usdt,
                oracle: address(oracle2),
                irm: address(irm2),
                ltv: 80,
                lth: 85
            });

            pixcross.createPool(poolParams);

            poolParams = PoolParams({
                collateralToken: mockIP[2],
                loanToken: usdc,
                oracle: address(oracle3),
                irm: address(irm3),
                ltv: 75,
                lth: 80
            });

            pixcross.createPool(poolParams);

            console.log("Pixcross deployed at:", address(pixcross));
            console.log(
                "PixcrossCuratorFactory deployed at:",
                address(pixcrossCuratorFactory)
            );
            console.log("MockIrm deployed at:", address(irm1));
            console.log("MockIrm deployed at:", address(irm2));
            console.log("MockIrm deployed at:", address(irm3));
            console.log("MockOracle deployed at:", address(oracle1));
            console.log("MockOracle deployed at:", address(oracle2));
            console.log("MockOracle deployed at:", address(oracle3));
            console.log("USDC:", usdc);
            console.log("USDT:", usdt);
            console.log("IDRX:", idrx);
            console.log("MockIP1:", mockIP[0]);
            console.log("MockIP2:", mockIP[1]);
            console.log("MockIP3:", mockIP[2]);
            console.log("MockIP4:", mockIP[3]);
            console.log("MockIP5:", mockIP[4]);
            console.log("MockIP6:", mockIP[5]);
            console.log("MockIP7:", mockIP[6]);
            console.log("MockIP8:", mockIP[7]);
            console.log("MockIP9:", mockIP[8]);
            console.log("MockIP10:", mockIP[9]);
            console.log("MockIP11:", mockIP[10]);
            console.log("MockIP12:", mockIP[11]);
        } else if (network == SupportedNetworks.BASE_SEPOLIA) {
            // FIXED: Convert annual rates to per-second rates
            uint256 secondsPerYear = 31536000;
            MockIrm irm4 = new MockIrm(3e17 / secondsPerYear);  // 30% annual
            MockIrm irm5 = new MockIrm(4e17 / secondsPerYear);  // 40% annual
            MockIrm irm6 = new MockIrm(2e17 / secondsPerYear);  // 20% annual
            MockOracle oracle4 = new MockOracle(3000e18);
            MockOracle oracle5 = new MockOracle(3500e18);
            MockOracle oracle6 = new MockOracle(4000e18);
            
            pixcross.setInterestRateModel(address(irm4), true);
            pixcross.setInterestRateModel(address(irm5), true);
            pixcross.setInterestRateModel(address(irm6), true);
            pixcross.setLTV(85, true);
            pixcross.setLTV(80, true);
            pixcross.setLTV(75, true);
            PoolParams memory poolParams = PoolParams({
                collateralToken: mockIP[3],
                loanToken: usdt,
                oracle: address(oracle4),
                irm: address(irm4),
                ltv: 85,
                lth: 90
            });
            pixcross.createPool(poolParams);
            poolParams = PoolParams({
                collateralToken: mockIP[4],
                loanToken: usdt,
                oracle: address(oracle5),
                irm: address(irm5),
                ltv: 80,
                lth: 85
            });
            pixcross.createPool(poolParams);
            poolParams = PoolParams({
                collateralToken: mockIP[5],
                loanToken: idrx,
                oracle: address(oracle6),
                irm: address(irm6),
                ltv: 75,
                lth: 80
            });
            pixcross.createPool(poolParams);
            console.log("Pixcross deployed at:", address(pixcross));
            console.log("PixcrossCuratorFactory deployed at:", address(pixcrossCuratorFactory));
            console.log("MockIrm deployed at:", address(irm4));
            console.log("MockIrm deployed at:", address(irm5));
            console.log("MockIrm deployed at:", address(irm6));
            console.log("MockOracle deployed at:", address(oracle4));
            console.log("MockOracle deployed at:", address(oracle5));
            console.log("MockOracle deployed at:", address(oracle6));
            console.log("USDC:", usdc);
            console.log("USDT:", usdt);
            console.log("IDRX:", idrx);
            console.log("MockIP1:", mockIP[0]);
            console.log("MockIP2:", mockIP[1]);
            console.log("MockIP3:", mockIP[2]);
            console.log("MockIP4:", mockIP[3]);
            console.log("MockIP5:", mockIP[4]);
            console.log("MockIP6:", mockIP[5]);
            console.log("MockIP7:", mockIP[6]);
            console.log("MockIP8:", mockIP[7]);
            console.log("MockIP9:", mockIP[8]);
            console.log("MockIP10:", mockIP[9]);
            console.log("MockIP11:", mockIP[10]);
            console.log("MockIP12:", mockIP[11]);
        } else if (network == SupportedNetworks.ARBITRUM_SEPOLIA) {
            // FIXED: Convert annual rates to per-second rates
            uint256 secondsPerYear = 31536000;
            MockIrm irm7 = new MockIrm(3e17 / secondsPerYear);  // 30% annual
            MockIrm irm8 = new MockIrm(4e17 / secondsPerYear);  // 40% annual
            MockIrm irm9 = new MockIrm(5e17 / secondsPerYear);  // 50% annual
            MockOracle oracle7 = new MockOracle(4500e18);
            MockOracle oracle8 = new MockOracle(5000e18);
            MockOracle oracle9 = new MockOracle(5500e18);
            
            pixcross.setInterestRateModel(address(irm7), true);
            pixcross.setInterestRateModel(address(irm8), true);
            pixcross.setInterestRateModel(address(irm9), true);
            pixcross.setLTV(85, true);
            pixcross.setLTV(80, true);
            pixcross.setLTV(75, true);
            PoolParams memory poolParams = PoolParams({
                collateralToken: mockIP[6],
                loanToken: idrx,
                oracle: address(oracle7),
                irm: address(irm7),
                ltv: 85,
                lth: 90
            });
            pixcross.createPool(poolParams);
            poolParams = PoolParams({
                collateralToken: mockIP[7],
                loanToken: idrx,
                oracle: address(oracle8),
                irm: address(irm8),
                ltv: 80,
                lth: 85
            });
            pixcross.createPool(poolParams);
            poolParams = PoolParams({
                collateralToken: mockIP[8],
                loanToken: usdc,
                oracle: address(oracle9),
                irm: address(irm9),
                ltv: 75,
                lth: 80
            });
            pixcross.createPool(poolParams);
            console.log("Pixcross deployed at:", address(pixcross));
            console.log("PixcrossCuratorFactory deployed at:", address(pixcrossCuratorFactory));
            console.log("MockIrm deployed at:", address(irm7));
            console.log("MockIrm deployed at:", address(irm8));
            console.log("MockIrm deployed at:", address(irm9));
            console.log("MockOracle deployed at:", address(oracle7));
            console.log("MockOracle deployed at:", address(oracle8));
            console.log("MockOracle deployed at:", address(oracle9));
            console.log("USDC:", usdc);
            console.log("USDT:", usdt);
            console.log("IDRX:", idrx);
            console.log("MockIP1:", mockIP[0]);
            console.log("MockIP2:", mockIP[1]);
            console.log("MockIP3:", mockIP[2]);
            console.log("MockIP4:", mockIP[3]);
            console.log("MockIP5:", mockIP[4]);
            console.log("MockIP6:", mockIP[5]);
            console.log("MockIP7:", mockIP[6]);
            console.log("MockIP8:", mockIP[7]);
            console.log("MockIP9:", mockIP[8]);
            console.log("MockIP10:", mockIP[9]);
            console.log("MockIP11:", mockIP[10]);
            console.log("MockIP12:", mockIP[11]);
        } else if (network == SupportedNetworks.AVALANCHE_FUJI) {
            // FIXED: Convert annual rates to per-second rates
            uint256 secondsPerYear = 31536000;
            MockIrm irm10 = new MockIrm(6e17 / secondsPerYear);  // 60% annual
            MockIrm irm11 = new MockIrm(7e17 / secondsPerYear);  // 70% annual
            MockIrm irm12 = new MockIrm(8e17 / secondsPerYear);  // 80% annual
            MockOracle oracle10 = new MockOracle(6000e18);
            MockOracle oracle11 = new MockOracle(6500e18);
            MockOracle oracle12 = new MockOracle(7000e18);
            
            pixcross.setInterestRateModel(address(irm10), true);
            pixcross.setInterestRateModel(address(irm11), true);
            pixcross.setInterestRateModel(address(irm12), true);
            pixcross.setLTV(85, true);
            pixcross.setLTV(80, true);
            pixcross.setLTV(75, true);
            PoolParams memory poolParams = PoolParams({
                collateralToken: mockIP[9],
                loanToken: usdc,
                oracle: address(oracle10),
                irm: address(irm10),
                ltv: 85,
                lth: 90
            });
            pixcross.createPool(poolParams);
            poolParams = PoolParams({
                collateralToken: mockIP[10],
                loanToken: usdc,
                oracle: address(oracle11),
                irm: address(irm11),
                ltv: 80,
                lth: 85
            });
            pixcross.createPool(poolParams);
            poolParams = PoolParams({
                collateralToken: mockIP[11],
                loanToken: idrx,
                oracle: address(oracle12),
                irm: address(irm12),
                ltv: 75,
                lth: 80
            });
            pixcross.createPool(poolParams);
            console.log("Pixcross deployed at:", address(pixcross));
            console.log("PixcrossCuratorFactory deployed at:", address(pixcrossCuratorFactory));
            console.log("MockIrm deployed at:", address(irm10));
            console.log("MockIrm deployed at:", address(irm11));
            console.log("MockIrm deployed at:", address(irm12));
            console.log("MockOracle deployed at:", address(oracle10));
            console.log("MockOracle deployed at:", address(oracle11));
            console.log("MockOracle deployed at:", address(oracle12));
            console.log("USDC:", usdc);
            console.log("USDT:", usdt);
            console.log("IDRX:", idrx);
            console.log("MockIP1:", mockIP[0]);
            console.log("MockIP2:", mockIP[1]);
            console.log("MockIP3:", mockIP[2]);
            console.log("MockIP4:", mockIP[3]);
            console.log("MockIP5:", mockIP[4]);
            console.log("MockIP6:", mockIP[5]);
            console.log("MockIP7:", mockIP[6]);
            console.log("MockIP8:", mockIP[7]);
            console.log("MockIP9:", mockIP[8]);
            console.log("MockIP10:", mockIP[9]);
            console.log("MockIP11:", mockIP[10]);
            console.log("MockIP12:", mockIP[11]);
        } else {
            revert("Unsupported network");
        }

        vm.stopBroadcast();
    }

    function getNFTsByNetwork(
        SupportedNetworks network
    ) internal pure returns (address[] memory) {
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
}
