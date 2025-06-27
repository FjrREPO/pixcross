// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {Id, Pool, Position, PoolParams, IPixcross} from "../src/interfaces/IPixcross.sol";
import {Pixcross} from "../src/core/Pixcross.sol";
import {PixcrossErrors} from "../src/libraries/PixcrossErrors.sol";
import {PixcrossEvents} from "../src/libraries/PixcrossEvents.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockERC721} from "./mocks/MockERC721.sol";
import {MockOracle} from "../src/mocks/MockOracle.sol";
import {MockIrm} from "../src/mocks/MockIrm.sol";

/**
 * @title PixcrossAuctionTest
 * @dev Simple tests focused on auction functionality in the Pixcross protocol
 */
contract PixcrossAuctionTest is Test {
    // Constants
    uint256 constant NFT_PRICE = 10 ether;
    uint256 constant LTV = 70; // 70%
    uint256 constant LTH = 80; // 80%
    uint256 constant BORROW_RATE = 0.05 * 1e18; // 5% APR
    uint256 constant AUCTION_DURATION = 24 hours;

    // Test accounts
    address borrower;
    address lender;
    address bidder1;
    address bidder2;

    // Core contracts
    Pixcross pixcross;
    MockERC20 loanToken;
    MockERC721 nftToken;
    MockOracle oracle;
    MockIrm irm;

    // Pool data
    Id poolId;
    uint256 tokenId;

    function setUp() public {
        // Setup accounts
        borrower = makeAddr("borrower");
        lender = makeAddr("lender");
        bidder1 = makeAddr("bidder1");
        bidder2 = makeAddr("bidder2");

        // Deploy contracts
        loanToken = new MockERC20("Loan Token", "LOAN", 18);
        nftToken = new MockERC721(
            "BAYC",
            "BAYC",
            "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/6325"
        );
        oracle = new MockOracle(NFT_PRICE); // Initialize with default price
        irm = new MockIrm(BORROW_RATE); // Initialize with borrow rate
        pixcross = new Pixcross();

        // Mint tokens
        loanToken.mint(lender, 100 ether);
        loanToken.mint(bidder1, 100 ether);
        loanToken.mint(bidder2, 100 ether);

        tokenId = 1;
        nftToken.mint(borrower, tokenId);

        // Configure protocol
        pixcross.setInterestRateModel(address(irm), true);
        pixcross.setLTV(LTV, true);

        // Create pool
        poolId = pixcross.createPool(
            PoolParams({
                collateralToken: address(nftToken),
                loanToken: address(loanToken),
                oracle: address(oracle),
                irm: address(irm),
                ltv: LTV,
                lth: LTH
            })
        );

        // Setup approvals
        vm.startPrank(lender);
        loanToken.approve(address(pixcross), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(borrower);
        loanToken.approve(address(pixcross), type(uint256).max);
        nftToken.setApprovalForAll(address(pixcross), true);
        vm.stopPrank();

        vm.startPrank(bidder1);
        loanToken.approve(address(pixcross), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(bidder2);
        loanToken.approve(address(pixcross), type(uint256).max);
        vm.stopPrank();

        // Setup initial state: lender supplies, borrower borrows at max LTV
        vm.prank(lender);
        pixcross.supply(poolId, 100 ether, lender);

        vm.prank(borrower);
        pixcross.supplyCollateral(poolId, tokenId, borrower);

        uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
        vm.prank(borrower);
        pixcross.borrow(poolId, tokenId, maxBorrow, borrower, borrower);
    }

    /*//////////////////////////////////////////////////////////////
                        AUCTION START CONDITIONS
    //////////////////////////////////////////////////////////////*/

    function testCannotStartAuctionForHealthyPosition() public {
        // Position is still healthy with current price
        vm.prank(bidder1);
        vm.expectRevert();
        pixcross.startAuction(poolId, tokenId);
    }

    function testStartAuctionAfterPriceDrop() public {
        // Drop price to make position unhealthy
        // LTH is 80%, so dropping price below borrowAmount/LTH makes it liquidatable
        uint256 borrowAmount = (NFT_PRICE * LTV) / 100;
        uint256 unhealthyPrice = (borrowAmount * 100) / LTH - 0.01 ether;
        oracle.setPrice(unhealthyPrice);

        // Now auction can be started
        vm.prank(bidder1);
        bool started = pixcross.startAuction(poolId, tokenId);
        assertTrue(started);

        // Verify auction state
        (, address positionOwner) = pixcross.getPosition(poolId, tokenId);
        assertEq(positionOwner, borrower);

        // Since we can't directly access endTime through getPosition, we can verify
        // the auction was successfully started by checking other means:
        // 1. Attempt to start another auction should fail (tested in testCannotStartAuctionTwice)
        // 2. We can verify bid mechanics function as expected
    }

    function testCannotStartAuctionTwice() public {
        // Make position liquidatable
        oracle.setPrice((NFT_PRICE * 70) / 100);

        // Start auction
        vm.prank(bidder1);
        pixcross.startAuction(poolId, tokenId);

        // Try to start again
        vm.prank(bidder2);
        vm.expectRevert();
        pixcross.startAuction(poolId, tokenId);
    }

    /*//////////////////////////////////////////////////////////////
                            BIDDING MECHANICS
    //////////////////////////////////////////////////////////////*/

    function testPlaceBid() public {
        // Setup: make position liquidatable and start auction
        oracle.setPrice((NFT_PRICE * 70) / 100);
        vm.prank(bidder1);
        pixcross.startAuction(poolId, tokenId);

        // Place bid
        uint256 borrowAmount = (NFT_PRICE * LTV) / 100;
        uint256 bidAmount = borrowAmount + 0.1 ether;

        vm.prank(bidder1);
        bool bidPlaced = pixcross.bid(poolId, tokenId, bidAmount);
        assertTrue(bidPlaced);

        // We cannot directly access bidder and bid amount through getPosition
        // Instead, we can verify indirectly by checking that:
        // 1. The bid was reported as successful (already checked with assertTrue(bidPlaced))
        // 2. Later tests will verify we can outbid and settle
    }

    function testOutbid() public {
        // Setup: make position liquidatable, start auction, and place first bid
        oracle.setPrice((NFT_PRICE * 70) / 100);
        vm.prank(bidder1);
        pixcross.startAuction(poolId, tokenId);

        uint256 borrowAmount = (NFT_PRICE * LTV) / 100;
        uint256 firstBidAmount = borrowAmount + 0.1 ether;

        vm.prank(bidder1);
        pixcross.bid(poolId, tokenId, firstBidAmount);

        // Place higher bid
        uint256 secondBidAmount = firstBidAmount + 0.2 ether;
        vm.prank(bidder2);
        bool outbid = pixcross.bid(poolId, tokenId, secondBidAmount);
        assertTrue(outbid);

        // We cannot directly access bidder and bid amount
        // Instead, we verify bid was successful via the returned boolean
        // Additional verification happens in settlement tests where only the highest bidder can settle
    }

    function testCannotBidBelowMinimum() public {
        // Setup: make position liquidatable and start auction
        oracle.setPrice((NFT_PRICE * 70) / 100);
        vm.prank(bidder1);
        pixcross.startAuction(poolId, tokenId);

        // Try to bid below debt amount
        uint256 borrowAmount = (NFT_PRICE * LTV) / 100;
        uint256 lowBid = borrowAmount - 0.1 ether;

        vm.prank(bidder1);
        vm.expectRevert();
        pixcross.bid(poolId, tokenId, lowBid);
    }

    function testCannotBidAfterAuctionEnds() public {
        // Setup: make position liquidatable, start auction
        oracle.setPrice((NFT_PRICE * 70) / 100);
        vm.prank(bidder1);
        pixcross.startAuction(poolId, tokenId);

        // Place bid
        uint256 borrowAmount = (NFT_PRICE * LTV) / 100;
        uint256 bidAmount = borrowAmount + 0.1 ether;
        vm.prank(bidder1);
        pixcross.bid(poolId, tokenId, bidAmount);

        // Fast forward to after auction end (24 hours from now)
        vm.warp(block.timestamp + AUCTION_DURATION + 1);

        // Try to place bid after auction ended
        uint256 lateBid = bidAmount + 0.2 ether;
        vm.prank(bidder2);
        vm.expectRevert();
        pixcross.bid(poolId, tokenId, lateBid);
    }

    /*//////////////////////////////////////////////////////////////
                          AUCTION SETTLEMENT
    //////////////////////////////////////////////////////////////*/

    function testSettleAuction() public {
        // Setup: make position liquidatable, start auction, place bid
        oracle.setPrice((NFT_PRICE * 70) / 100);
        vm.prank(bidder1);
        pixcross.startAuction(poolId, tokenId);

        uint256 borrowAmount = (NFT_PRICE * LTV) / 100;
        uint256 bidAmount = borrowAmount + 0.5 ether;
        vm.prank(bidder1);
        pixcross.bid(poolId, tokenId, bidAmount);

        // Fast forward to auction end (24 hours from now)
        vm.warp(block.timestamp + AUCTION_DURATION + 1);

        // Settle auction
        vm.prank(bidder1);
        bool settled = pixcross.settleAuction(poolId, tokenId);
        assertTrue(settled);

        // Verify NFT ownership transfer
        assertEq(nftToken.ownerOf(tokenId), bidder1);

        // Verify debt cleared
        (uint256 borrowShares, ) = pixcross.getPosition(poolId, tokenId);
        assertEq(borrowShares, 0);
    }

    function testCannotSettleBeforeAuctionEnds() public {
        // Setup: make position liquidatable, start auction, place bid
        oracle.setPrice((NFT_PRICE * 70) / 100);
        vm.prank(bidder1);
        pixcross.startAuction(poolId, tokenId);

        uint256 borrowAmount = (NFT_PRICE * LTV) / 100;
        uint256 bidAmount = borrowAmount + 0.1 ether;
        vm.prank(bidder1);
        pixcross.bid(poolId, tokenId, bidAmount);

        // Try to settle before auction ends
        vm.prank(bidder1);
        vm.expectRevert();
        pixcross.settleAuction(poolId, tokenId);
    }

    function testOnlyHighestBidderCanSettle() public {
        // Setup: make position liquidatable, start auction, place bid
        oracle.setPrice((NFT_PRICE * 70) / 100);
        vm.prank(bidder1);
        pixcross.startAuction(poolId, tokenId);

        uint256 borrowAmount = (NFT_PRICE * LTV) / 100;
        uint256 bidAmount = borrowAmount + 0.1 ether;
        vm.prank(bidder1);
        pixcross.bid(poolId, tokenId, bidAmount);

        // Fast forward to auction end (24 hours from now)
        vm.warp(block.timestamp + AUCTION_DURATION + 1);

        // Try to settle as non-highest bidder (bidder2 is not the highest bidder)
        vm.startPrank(bidder2);
        // Using a generic unauthorized error selector
        vm.expectRevert(
            abi.encodeWithSelector(
                PixcrossErrors.Unauthorized.selector,
                bidder2,
                "highest bidder"
            )
        );
        pixcross.settleAuction(poolId, tokenId);
        vm.stopPrank();

        // Verify that the highest bidder (bidder1) can settle
        vm.prank(bidder1);
        bool settled = pixcross.settleAuction(poolId, tokenId);
        assertTrue(settled);

        // Verify NFT ownership transfer to bidder1
        assertEq(nftToken.ownerOf(tokenId), bidder1);
    }

    /*//////////////////////////////////////////////////////////////
                    PRICE-BASED LIQUIDATION THRESHOLDS
    //////////////////////////////////////////////////////////////*/

    function testLiquidationThresholdCalculation() public {
        // Starting LTV is 70%, LTH is 80%
        uint256 borrowAmount = (NFT_PRICE * LTV) / 100;

        // Test different price points

        // 1. Price at 95% of original: Position still healthy
        uint256 price95pct = (NFT_PRICE * 95) / 100;
        oracle.setPrice(price95pct);

        // Position should be healthy (liquidation threshold is 80% of NFT_PRICE)
        // Which means we expect a revert with NotAuctionable error
        vm.prank(bidder1);
        vm.expectRevert(
            abi.encodeWithSelector(
                PixcrossErrors.NotAuctionable.selector,
                tokenId,
                1085714285714285714
            )
        );
        pixcross.startAuction(poolId, tokenId);

        // 2. Price at exactly liquidation threshold
        // At LTH of 80%, the minimum price to stay healthy is borrowAmount/0.8
        uint256 thresholdPrice = (borrowAmount * 100) / LTH;
        oracle.setPrice(thresholdPrice);

        // At exactly the threshold, position should still be healthy
        vm.prank(bidder1);
        vm.expectRevert(
            abi.encodeWithSelector(
                PixcrossErrors.NotAuctionable.selector,
                tokenId,
                1000000000000000000
            )
        );
        pixcross.startAuction(poolId, tokenId);

        // 3. Price just below liquidation threshold
        uint256 belowThresholdPrice = thresholdPrice - 0.1 ether; // Make it more below threshold
        oracle.setPrice(belowThresholdPrice);

        // Now the position should be liquidatable
        vm.prank(bidder1);
        bool canLiquidate = pixcross.startAuction(poolId, tokenId);
        assertTrue(canLiquidate);
    }

    function testHealthFactorImprovesAfterPartialRepay() public {
        // Partial repayment should improve health factor

        // First, drop price to near liquidation threshold
        uint256 borrowAmount = (NFT_PRICE * LTV) / 100;
        uint256 nearThresholdPrice = (borrowAmount * 100) / LTH + 0.1 ether;
        oracle.setPrice(nearThresholdPrice);

        // Position still healthy but close to threshold
        vm.prank(bidder1);
        vm.expectRevert();
        pixcross.startAuction(poolId, tokenId);

        // Repay half the loan
        vm.startPrank(borrower);
        (uint256 borrowShares, ) = pixcross.getPosition(poolId, tokenId);
        pixcross.repay(poolId, tokenId, borrowShares / 2, borrower);
        vm.stopPrank();

        // Drop price further, but position should still be healthy due to partial repayment
        uint256 lowerPrice = (nearThresholdPrice * 90) / 100;
        oracle.setPrice(lowerPrice);

        // Should still not be liquidatable
        vm.prank(bidder1);
        vm.expectRevert();
        pixcross.startAuction(poolId, tokenId);
    }

    /*//////////////////////////////////////////////////////////////
                        BATCH LIQUIDATION TESTS
    //////////////////////////////////////////////////////////////*/

    function testBatchLiquidateAndStartAuctionsWithMultipleTokens() public {
        // Create multiple positions with different NFTs
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1; // Already exists from setUp
        tokenIds[1] = 2;
        tokenIds[2] = 3;
        
        // Mint additional NFTs and create positions
        for (uint256 i = 1; i < tokenIds.length; i++) {
            nftToken.mint(borrower, tokenIds[i]);
            
            vm.prank(borrower);
            pixcross.supplyCollateral(poolId, tokenIds[i], borrower);
            
            uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
            vm.prank(borrower);
            pixcross.borrow(poolId, tokenIds[i], maxBorrow, borrower, borrower);
        }
        
        // All positions are healthy initially
        (uint256 liquidatedCount, uint256[] memory liquidatedTokenIds) = pixcross.batchLiquidateAndStartAuctions(poolId, tokenIds);
        assertEq(liquidatedCount, 0);
        assertEq(liquidatedTokenIds.length, 0);
        
        // Drop price to make all positions liquidatable
        oracle.setPrice((NFT_PRICE * 70) / 100);
        
        // Now batch liquidate
        (liquidatedCount, liquidatedTokenIds) = pixcross.batchLiquidateAndStartAuctions(poolId, tokenIds);
        
        // All 3 positions should be liquidated
        assertEq(liquidatedCount, 3);
        assertEq(liquidatedTokenIds.length, 3);
        
        // Verify all token IDs are in the result
        for (uint256 i = 0; i < tokenIds.length; i++) {
            bool found = false;
            for (uint256 j = 0; j < liquidatedTokenIds.length; j++) {
                if (liquidatedTokenIds[j] == tokenIds[i]) {
                    found = true;
                    break;
                }
            }
            assertTrue(found, "Token ID not found in liquidated list");
        }
    }
    
    function testBatchLiquidateAndStartAuctionsWithMixedHealthPositions() public {
        // Create multiple positions with different NFTs
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1; // Already exists from setUp
        tokenIds[1] = 2;
        tokenIds[2] = 3;
        
        // Mint additional NFTs and create positions
        for (uint256 i = 1; i < tokenIds.length; i++) {
            nftToken.mint(borrower, tokenIds[i]);
            
            vm.prank(borrower);
            pixcross.supplyCollateral(poolId, tokenIds[i], borrower);
        }
        
        // Create different borrow amounts for different health factors
        // Token 1: Max borrow (will be unhealthy when price drops)
        uint256 maxBorrow1 = (NFT_PRICE * LTV) / 100;
        
        // Token 2: Half borrow (will stay healthy)
        uint256 halfBorrow2 = maxBorrow1 / 2;
        vm.prank(borrower);
        pixcross.borrow(poolId, tokenIds[1], halfBorrow2, borrower, borrower);
        
        // Token 3: Three-quarter borrow (will be unhealthy when price drops)
        uint256 threeQuarterBorrow3 = (maxBorrow1 * 3) / 4;
        vm.prank(borrower);
        pixcross.borrow(poolId, tokenIds[2], threeQuarterBorrow3, borrower, borrower);
        
        // Drop price to make positions 1 and 3 liquidatable but keep 2 healthy
        // For token 3 with 5.25e18 borrowed to be liquidatable:
        // health factor = (price * 80%) / 5.25e18 < 1
        // price < 5.25e18 / 0.8 = 6.5625e18
        // So we set price to 6.5e18 to make token 3 liquidatable
        oracle.setPrice(6500000000000000000); // 6.5 ether
        
        // Batch liquidate
        (uint256 liquidatedCount, uint256[] memory liquidatedTokenIds) = pixcross.batchLiquidateAndStartAuctions(poolId, tokenIds);
        
        // Should liquidate 2 positions (tokens 1 and 3)
        assertEq(liquidatedCount, 2);
        assertEq(liquidatedTokenIds.length, 2);
        
        // Verify liquidated tokens are 1 and 3
        bool found1 = false;
        bool found3 = false;
        for (uint256 i = 0; i < liquidatedTokenIds.length; i++) {
            if (liquidatedTokenIds[i] == tokenIds[0]) found1 = true;
            if (liquidatedTokenIds[i] == tokenIds[2]) found3 = true;
        }
        assertTrue(found1, "Token 1 should be liquidated");
        assertTrue(found3, "Token 3 should be liquidated");
    }
    
    function testBatchLiquidateAndStartAuctionsSkipsNonExistentPositions() public {
        // Create array with mix of existing and non-existing token IDs
        uint256[] memory tokenIds = new uint256[](5);
        tokenIds[0] = 1; // Exists from setUp
        tokenIds[1] = 100; // Doesn't exist
        tokenIds[2] = 200; // Doesn't exist  
        tokenIds[3] = 2; // Will create
        tokenIds[4] = 300; // Doesn't exist
        
        // Create one more position
        nftToken.mint(borrower, 2);
        vm.prank(borrower);
        pixcross.supplyCollateral(poolId, 2, borrower);
        
        uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
        vm.prank(borrower);
        pixcross.borrow(poolId, 2, maxBorrow, borrower, borrower);
        
        // Drop price to make positions liquidatable
        oracle.setPrice((NFT_PRICE * 70) / 100);
        
        // Batch liquidate (should only process existing positions)
        (uint256 liquidatedCount, uint256[] memory liquidatedTokenIds) = pixcross.batchLiquidateAndStartAuctions(poolId, tokenIds);
        
        // Should liquidate 2 positions (tokens 1 and 2)
        assertEq(liquidatedCount, 2);
        assertEq(liquidatedTokenIds.length, 2);
    }
    
    function testBatchLiquidateAndStartAuctionsSkipsAlreadyStartedAuctions() public {
        // Create multiple positions
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 1; // Already exists from setUp
        tokenIds[1] = 2;
        
        // Create second position
        nftToken.mint(borrower, 2);
        vm.prank(borrower);
        pixcross.supplyCollateral(poolId, 2, borrower);
        
        uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
        vm.prank(borrower);
        pixcross.borrow(poolId, 2, maxBorrow, borrower, borrower);
        
        // Drop price to make positions liquidatable
        oracle.setPrice((NFT_PRICE * 70) / 100);
        
        // Manually start auction for token 1
        vm.prank(bidder1);
        pixcross.startAuction(poolId, 1);
        
        // Batch liquidate (should skip token 1 since auction already started)
        (uint256 liquidatedCount, uint256[] memory liquidatedTokenIds) = pixcross.batchLiquidateAndStartAuctions(poolId, tokenIds);
        
        // Should only liquidate token 2
        assertEq(liquidatedCount, 1);
        assertEq(liquidatedTokenIds.length, 1);
        assertEq(liquidatedTokenIds[0], 2);
    }
    
    /*//////////////////////////////////////////////////////////////
                        AUTO LIQUIDATE POOL TESTS
    //////////////////////////////////////////////////////////////*/
    
    function testAutoLiquidatePoolScansSequentialTokens() public {
        // Create multiple sequential positions
        for (uint256 i = 2; i <= 5; i++) {
            nftToken.mint(borrower, i);
            
            vm.prank(borrower);
            pixcross.supplyCollateral(poolId, i, borrower);
            
            uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
            vm.prank(borrower);
            pixcross.borrow(poolId, i, maxBorrow, borrower, borrower);
        }
        
        // Drop price to make all positions liquidatable
        oracle.setPrice((NFT_PRICE * 70) / 100);
        
        // Auto liquidate starting from token 1, checking 5 tokens
        (uint256 liquidatedCount, uint256[] memory liquidatedTokenIds) = pixcross.autoLiquidatePool(poolId, 1, 5);
        
        // Should liquidate 5 positions (tokens 1-5)
        assertEq(liquidatedCount, 5);
        assertEq(liquidatedTokenIds.length, 5);
        
        // Verify all token IDs 1-5 are in the result
        for (uint256 i = 1; i <= 5; i++) {
            bool found = false;
            for (uint256 j = 0; j < liquidatedTokenIds.length; j++) {
                if (liquidatedTokenIds[j] == i) {
                    found = true;
                    break;
                }
            }
            assertTrue(found, string(abi.encodePacked("Token ", vm.toString(i), " not found in liquidated list")));
        }
    }
    
    function testAutoLiquidatePoolRespectsMaxTokensLimit() public {
        // Create 5 positions but only check 3
        for (uint256 i = 2; i <= 5; i++) {
            nftToken.mint(borrower, i);
            
            vm.prank(borrower);
            pixcross.supplyCollateral(poolId, i, borrower);
            
            uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
            vm.prank(borrower);
            pixcross.borrow(poolId, i, maxBorrow, borrower, borrower);
        }
        
        // Drop price to make all positions liquidatable
        oracle.setPrice((NFT_PRICE * 70) / 100);
        
        // Auto liquidate starting from token 1, checking only 3 tokens
        (uint256 liquidatedCount, uint256[] memory liquidatedTokenIds) = pixcross.autoLiquidatePool(poolId, 1, 3);
        
        // Should liquidate 3 positions (tokens 1-3)
        assertEq(liquidatedCount, 3);
        assertEq(liquidatedTokenIds.length, 3);
    }
    
    function testAutoLiquidatePoolFailsWithInvalidMaxTokens() public {
        // Test with maxTokensToCheck = 0
        vm.expectRevert("Invalid maxTokensToCheck range");
        pixcross.autoLiquidatePool(poolId, 1, 0);
        
        // Test with maxTokensToCheck > 100
        vm.expectRevert("Invalid maxTokensToCheck range");
        pixcross.autoLiquidatePool(poolId, 1, 101);
    }
    
    function testAutoLiquidatePoolSkipsEmptyPositions() public {
        // Only create positions for tokens 1, 3, and 5 (skip 2 and 4)
        nftToken.mint(borrower, 3);
        vm.prank(borrower);
        pixcross.supplyCollateral(poolId, 3, borrower);
        
        uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
        vm.prank(borrower);
        pixcross.borrow(poolId, 3, maxBorrow, borrower, borrower);
        
        nftToken.mint(borrower, 5);
        vm.prank(borrower);
        pixcross.supplyCollateral(poolId, 5, borrower);
        
        vm.prank(borrower);
        pixcross.borrow(poolId, 5, maxBorrow, borrower, borrower);
        
        // Drop price to make positions liquidatable
        oracle.setPrice((NFT_PRICE * 70) / 100);
        
        // Auto liquidate starting from token 1, checking 5 tokens
        (uint256 liquidatedCount, uint256[] memory liquidatedTokenIds) = pixcross.autoLiquidatePool(poolId, 1, 5);
        
        // Should liquidate 3 positions (tokens 1, 3, 5)
        assertEq(liquidatedCount, 3);
        assertEq(liquidatedTokenIds.length, 3);
        
        // Verify tokens 1, 3, 5 are liquidated
        bool found1 = false;
        bool found3 = false;
        bool found5 = false;
        for (uint256 i = 0; i < liquidatedTokenIds.length; i++) {
            if (liquidatedTokenIds[i] == 1) found1 = true;
            else if (liquidatedTokenIds[i] == 3) found3 = true;
            else if (liquidatedTokenIds[i] == 5) found5 = true;
        }
        assertTrue(found1, "Token 1 should be liquidated");
        assertTrue(found3, "Token 3 should be liquidated");
        assertTrue(found5, "Token 5 should be liquidated");
    }
    
    /*//////////////////////////////////////////////////////////////
                    BATCH LIQUIDATION EVENT TESTS
    //////////////////////////////////////////////////////////////*/
    
    function testBatchLiquidationExecutedEventEmitted() public {
        // Create multiple positions
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        
        nftToken.mint(borrower, 2);
        vm.prank(borrower);
        pixcross.supplyCollateral(poolId, 2, borrower);
        
        uint256 maxBorrow = (NFT_PRICE * LTV) / 100;
        vm.prank(borrower);
        pixcross.borrow(poolId, 2, maxBorrow, borrower, borrower);
        
        // Drop price to make positions liquidatable
        oracle.setPrice((NFT_PRICE * 70) / 100);
        
        // Expect BatchLiquidationExecuted event
        vm.expectEmit(true, false, false, true);
        emit PixcrossEvents.BatchLiquidationExecuted(poolId, 2, tokenIds);
        
        // Batch liquidate
        pixcross.batchLiquidateAndStartAuctions(poolId, tokenIds);
    }
    
    /*//////////////////////////////////////////////////////////////
                    INTEGRATION WITH EXISTING AUCTION SYSTEM
    //////////////////////////////////////////////////////////////*/
    
    function testBatchLiquidatedPositionsCanBeSettled() public {
        // Create position and batch liquidate
        oracle.setPrice((NFT_PRICE * 70) / 100);
        
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 1;
        
        (uint256 liquidatedCount,) = pixcross.batchLiquidateAndStartAuctions(poolId, tokenIds);
        assertEq(liquidatedCount, 1);
        
        // Place bid on liquidated position
        uint256 borrowAmount = (NFT_PRICE * LTV) / 100;
        uint256 bidAmount = borrowAmount + 0.1 ether;
        
        vm.prank(bidder1);
        pixcross.bid(poolId, 1, bidAmount);
        
        // Fast forward and settle
        vm.warp(block.timestamp + AUCTION_DURATION + 1);
        
        vm.prank(bidder1);
        bool settled = pixcross.settleAuction(poolId, 1);
        assertTrue(settled);
        
        // Verify NFT transfer
        assertEq(nftToken.ownerOf(1), bidder1);
    }
}
