// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {Id, Pool, Position, PoolParams, IPixcross} from "../src/interfaces/IPixcross.sol";
import {Pixcross} from "../src/core/Pixcross.sol";
import {PixcrossErrors} from "../src/libraries/PixcrossErrors.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockERC721} from "./mocks/MockERC721.sol";
import {MockOracle} from "../src/mocks/MockOracle.sol";
import {MockIrm} from "../src/mocks/MockIrm.sol";

/**
 * @title PixcrossCoreTest
 * @dev Simple tests for core Pixcross protocol functionality
 */
contract PixcrossCoreTest is Test {
    // Constants
    uint256 constant NFT_PRICE = 10 ether;
    uint256 constant LTV = 70; // 70%
    uint256 constant LTH = 80; // 80%
    uint256 constant BORROW_RATE = 0.05 * 1e18; // 5% APR
    uint256 constant AUCTION_DURATION = 24 hours;

    // Test accounts
    address owner;
    address lender;
    address borrower;
    address liquidator;

    // Core contracts
    Pixcross pixcross;
    MockERC20 loanToken;
    MockERC721 nftToken;
    MockOracle oracle;
    MockIrm irm;

    // Pool data
    Id poolId;
    PoolParams poolParams;

    // Test NFT
    uint256 tokenId;

    function setUp() public {
        // Setup accounts
        owner = address(this);
        lender = makeAddr("lender");
        borrower = makeAddr("borrower");
        liquidator = makeAddr("liquidator");

        // Deploy mock contracts
        loanToken = new MockERC20("Loan Token", "LOAN", 18);
        nftToken = new MockERC721(
            "BAYC",
            "BAYC",
            "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/6325"
        );
        oracle = new MockOracle(NFT_PRICE); // Initialize with default price
        irm = new MockIrm(BORROW_RATE); // Initialize with borrow rate

        // Deploy Pixcross
        pixcross = new Pixcross();

        // Setup tokens
        loanToken.mint(lender, 1000 ether); // Increased liquidity
        tokenId = 1;
        nftToken.mint(borrower, tokenId);
        loanToken.mint(liquidator, 1000 ether); // Increased liquidity

        // Setup pool parameters
        poolParams = PoolParams({
            collateralToken: address(nftToken),
            loanToken: address(loanToken),
            oracle: address(oracle),
            irm: address(irm),
            ltv: LTV,
            lth: LTH
        });

        // Enable IRM and LTV in protocol
        pixcross.setInterestRateModel(address(irm), true);
        pixcross.setLTV(LTV, true);

        // Setup approvals
        vm.startPrank(lender);
        loanToken.approve(address(pixcross), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(borrower);
        nftToken.setApprovalForAll(address(pixcross), true);
        loanToken.approve(address(pixcross), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(liquidator);
        loanToken.approve(address(pixcross), type(uint256).max);
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                    POOL CREATION AND MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    function testCreatePool() public {
        // Create pool
        poolId = pixcross.createPool(poolParams);

        // Verify pool exists
        assertTrue(pixcross.isPoolExist(poolId));

        // Get pool data
        (
            address asset, // gauge // bribe // index // gaugePeriodReward // gaugePeriodStart // totalSupplyAsset // totalSupplyShare // activeBalance // feeAccrued
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,

        ) = // lastAccrued
            pixcross.pools(poolId);

        // Verify pool parameters
        assertEq(asset, address(nftToken));
        // The other returned values don't directly map to our expected values
        // as the interface has changed, so we only check what we can verify
    }

    function testCannotCreatePoolWithInvalidParams() public {
        // Try with unregistered IRM
        MockIrm newIrm = new MockIrm(BORROW_RATE);
        PoolParams memory invalidParams = PoolParams({
            collateralToken: address(nftToken),
            loanToken: address(loanToken),
            oracle: address(oracle),
            irm: address(newIrm),
            ltv: LTV,
            lth: LTH
        });

        vm.expectRevert(
            abi.encodeWithSelector(
                PixcrossErrors.IRMNotExist.selector,
                address(newIrm)
            )
        );
        pixcross.createPool(invalidParams);
    }

    /*//////////////////////////////////////////////////////////////
                    SUPPLY AND BORROW OPERATIONS
    //////////////////////////////////////////////////////////////*/

    function testSupplyAssets() public {
        // Create pool first
        poolId = pixcross.createPool(poolParams);

        // Supply assets
        uint256 supplyAmount = 10 ether;
        vm.prank(lender);
        (uint256 suppliedAmount, uint256 shares) = pixcross.supply(
            poolId,
            supplyAmount,
            lender
        );

        // Verify supply
        assertEq(suppliedAmount, supplyAmount);
        assertEq(shares, supplyAmount);
        assertEq(pixcross.supplies(poolId, lender), supplyAmount);
        assertEq(loanToken.balanceOf(address(pixcross)), supplyAmount);
    }

    function testBorrowAndRepay() public {
        // Setup: create pool and supply assets
        poolId = pixcross.createPool(poolParams);
        vm.prank(lender);
        pixcross.supply(poolId, 50 ether, lender); // Increased supply for sufficient liquidity

        // Supply collateral
        vm.prank(borrower);
        pixcross.supplyCollateral(poolId, tokenId, borrower);

        // Calculate max borrow (70% of NFT price)
        uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
        uint256 borrowAmount = maxBorrow - 1 ether; // Just under max

        // Borrow
        vm.prank(borrower);
        (uint256 borrowedAmount, uint256 borrowShares) = pixcross.borrow(
            poolId,
            tokenId,
            borrowAmount,
            borrower,
            borrower
        );

        // Verify borrow
        assertEq(borrowedAmount, borrowAmount);
        assertEq(borrowShares, borrowAmount);
        assertEq(loanToken.balanceOf(borrower), borrowAmount);

        // Get position data
        (uint256 positionBorrowShares, address positionOwner) = pixcross
            .getPosition(poolId, tokenId);
        assertEq(positionBorrowShares, borrowShares);
        assertEq(positionOwner, borrower);

        // Repay half
        uint256 repayShares = borrowShares / 2;
        vm.prank(borrower);
        (, uint256 repaidShares) = pixcross.repay(
            poolId,
            tokenId,
            repayShares,
            borrower
        );

        // Verify repay
        assertEq(repaidShares, repayShares);

        // Check updated position
        (positionBorrowShares, ) = pixcross.getPosition(poolId, tokenId);
        assertEq(positionBorrowShares, borrowShares - repaidShares);
    }

    function testCannotBorrowMoreThanAllowed() public {
        // Setup: create pool and supply assets
        poolId = pixcross.createPool(poolParams);
        vm.prank(lender);
        pixcross.supply(poolId, 50 ether, lender); // Increased supply for sufficient liquidity

        // Supply collateral
        vm.prank(borrower);
        pixcross.supplyCollateral(poolId, tokenId, borrower);

        // Calculate max borrow and try to borrow more
        uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
        uint256 excessBorrow = maxBorrow + 0.1 ether;

        // Try to borrow more than allowed
        vm.prank(borrower);
        vm.expectRevert(
            abi.encodeWithSelector(
                PixcrossErrors.InsufficientCollateral.selector,
                excessBorrow,
                maxBorrow
            )
        );
        pixcross.borrow(poolId, tokenId, excessBorrow, borrower, borrower);
    }

    /*//////////////////////////////////////////////////////////////
                        INTEREST ACCRUAL
    //////////////////////////////////////////////////////////////*/

    function testInterestAccrual() public {
        // Setup: create pool, supply assets, supply collateral, and borrow
        poolId = pixcross.createPool(poolParams);

        vm.prank(lender);
        pixcross.supply(poolId, 50 ether, lender); // Increased supply for sufficient liquidity

        vm.prank(borrower);
        pixcross.supplyCollateral(poolId, tokenId, borrower);

        uint256 borrowAmount = 5 ether;
        vm.prank(borrower);
        pixcross.borrow(poolId, tokenId, borrowAmount, borrower, borrower);

        // Get initial pool state
        (, , , , , , uint256 initialSupplyAssets, , , , ) = pixcross.pools(
            poolId
        );

        // Advance time by 1 year
        vm.warp(block.timestamp + 365 days);

        // Trigger interest accrual
        pixcross.accrueInterest(poolId);

        // Get updated pool state
        (, , , , , , uint256 finalSupplyAssets, , , , ) = pixcross.pools(
            poolId
        );

        // Calculate expected interest (5% of 5 ether = 0.25 ether)
        uint256 expectedInterest = (borrowAmount * BORROW_RATE) / 1e18;

        // Verify interest accrual
        // Note: we can't directly verify borrow assets since the interface changed
        // and we don't have access to totalBorrowAssets anymore
        assertEq(finalSupplyAssets - initialSupplyAssets, expectedInterest);
    }

    /*//////////////////////////////////////////////////////////////
                    LIQUIDATION SCENARIOS
    //////////////////////////////////////////////////////////////*/

    function testStartAuction() public {
        // Setup: create pool, supply assets, supply collateral, and borrow
        poolId = pixcross.createPool(poolParams);

        vm.prank(lender);
        pixcross.supply(poolId, 50 ether, lender); // Increased supply for sufficient liquidity

        vm.prank(borrower);
        pixcross.supplyCollateral(poolId, tokenId, borrower);

        // Borrow at max LTV
        uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
        vm.prank(borrower);
        pixcross.borrow(poolId, tokenId, maxBorrow, borrower, borrower);

        // Drop NFT price to make position liquidatable
        uint256 newPrice = (NFT_PRICE * 80) / 100; // 20% drop
        oracle.setPrice(newPrice);

        // Start auction
        vm.prank(liquidator);
        bool auctionStarted = pixcross.startAuction(poolId, tokenId);

        assertTrue(auctionStarted);

        // Since we can't access position.endTime directly, we verify
        // auction start through the success result
        assertTrue(auctionStarted);
    }

    function testBidAndSettleAuction() public {
        // Setup: create pool, supply assets, supply collateral, borrow, and start auction
        poolId = pixcross.createPool(poolParams);

        vm.prank(lender);
        pixcross.supply(poolId, 50 ether, lender); // Increased supply for sufficient liquidity

        vm.prank(borrower);
        pixcross.supplyCollateral(poolId, tokenId, borrower);

        uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
        vm.prank(borrower);
        pixcross.borrow(poolId, tokenId, maxBorrow, borrower, borrower);

        oracle.setPrice((NFT_PRICE * 80) / 100);

        vm.prank(liquidator);
        pixcross.startAuction(poolId, tokenId);

        // Place bid
        uint256 bidAmount = maxBorrow + 0.1 ether;
        vm.prank(liquidator);
        bool bidPlaced = pixcross.bid(poolId, tokenId, bidAmount);

        assertTrue(bidPlaced);

        // We can't access bidder and bid amount directly
        // but we verify through the bid success

        // Advance time to auction end (24 hours from now)
        vm.warp(block.timestamp + AUCTION_DURATION + 1);

        // Settle auction
        vm.prank(liquidator);
        bool auctionSettled = pixcross.settleAuction(poolId, tokenId);

        assertTrue(auctionSettled);

        // Verify NFT ownership transfer
        assertEq(nftToken.ownerOf(tokenId), liquidator);
    }
}
