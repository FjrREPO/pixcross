// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IPixcross, Id} from "@interfaces/IPixcross.sol";
import {PixcrossCurator} from "@core/PixcrossCurator.sol";

contract PixcrossCuratorFactory {
    event CuratorDeployed(
        address indexed curator, string name, string symbol, address asset, bytes32[] pools, uint256[] allocations
    );

    /// @notice Scaling factor for allocations where 100% = 1e18
    /// @dev Examples: 50% = 50e16, 25% = 25e16, 100% = 1e18
    uint256 constant ALLOCATION_SCALED = 1e18;
    address public immutable pixcross;

    constructor(address _pixcross) {
        pixcross = _pixcross;
    }

    /**
     * @notice Deploys a new PixcrossCurator with specified allocations
     * @param n Name of the curator vault
     * @param s Symbol of the curator vault
     * @param a Address of the underlying asset
     * @param p Array of pool IDs to allocate to
     * @param al Array of allocation percentages (scaled by 1e18)
     *           Examples: [50e16, 30e16, 20e16] for 50%, 30%, 20%
     * @return c Address of the deployed curator
     */
    function deployCurator(
        string calldata n,
        string calldata s,
        address a,
        bytes32[] calldata p,
        uint256[] calldata al
    ) external returns (address c) {
        require(p.length != 0 && p.length == al.length);

        uint256 t;
        for (uint256 i; i < p.length;) {
            // Ensure allocation is not zero and not greater than 100%
            require(al[i] != 0, "Allocation cannot be zero");
            require(al[i] <= ALLOCATION_SCALED, "Individual allocation cannot exceed 100%");
            t += al[i];

            // Verify pool exists and is active
            (, , , , , , , , , , uint256 lastAccrued) = IPixcross(pixcross).pools(Id.wrap(p[i]));
            require(lastAccrued != 0, "Pool does not exist or is inactive");
            unchecked { ++i; }
        }
        // Ensure total allocation doesn't exceed 100%
        require(t <= ALLOCATION_SCALED, "Total allocation cannot exceed 100%");

        c = address(new PixcrossCurator(n, s, pixcross, a));
        PixcrossCurator(c).setAllocation(p, al);
        PixcrossCurator(c).setPixcrossApproval(type(uint256).max);

        emit CuratorDeployed(c, n, s, a, p, al);
    }
}
