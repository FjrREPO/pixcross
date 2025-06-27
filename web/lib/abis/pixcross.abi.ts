import { Abi } from "viem";

export const pixcrossAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentTime",
        type: "uint256",
      },
    ],
    name: "AuctionAlreadyEnded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentTime",
        type: "uint256",
      },
    ],
    name: "AuctionNotYetEnded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bidAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minRequired",
        type: "uint256",
      },
    ],
    name: "BidTooLow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "outstandingDebt",
        type: "uint256",
      },
    ],
    name: "DebtNotZero",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "debtAmount",
        type: "uint256",
      },
    ],
    name: "ExcessiveRepayment",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "expected",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "received",
        type: "bytes32",
      },
    ],
    name: "FlashLoanCallbackFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "received",
        type: "uint256",
      },
    ],
    name: "FlashLoanRepaymentFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "irm",
        type: "address",
      },
    ],
    name: "IRMNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requested",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAllowed",
        type: "uint256",
      },
    ],
    name: "InsufficientCollateral",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requested",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
    ],
    name: "InsufficientLiquidity",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requested",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
    ],
    name: "InsufficientShares",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
    ],
    name: "LTVExceeded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lth",
        type: "uint256",
      },
    ],
    name: "LTVGreaterThanLTH",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
    ],
    name: "LTVNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "NoAuctionExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "healthFactor",
        type: "uint256",
      },
    ],
    name: "NotAuctionable",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "address",
        name: "actualOwner",
        type: "address",
      },
    ],
    name: "NotPositionOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "address",
        name: "actualOwner",
        type: "address",
      },
    ],
    name: "NotTokenOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "PoolAlreadyCreated",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "PoolNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "string",
        name: "requiredRole",
        type: "string",
      },
    ],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "paramName",
        type: "string",
      },
    ],
    name: "ZeroAddress",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "paramName",
        type: "string",
      },
    ],
    name: "ZeroAmount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "ZeroAmountCalculated",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ZeroSharesCalculated",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "bidder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "debtAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bidAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "excess",
        type: "uint256",
      },
    ],
    name: "AuctionSettled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "debtAmount",
        type: "uint256",
      },
    ],
    name: "AuctionStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "bidder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "previousBidder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "previousBid",
        type: "uint256",
      },
    ],
    name: "Bid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Borrow",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "FlashLoan",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "borrowRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "interest",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timeElapsed",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeShares",
        type: "uint256",
      },
    ],
    name: "InterestAccrued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "irm",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "InterestRateModelChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "LTVChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "OperatorSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "collateralToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "loanToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "oracle",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "irm",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lth",
        type: "uint256",
      },
    ],
    name: "PoolCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Repay",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Supply",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
    ],
    name: "SupplyCollateral",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "WithdrawCollateral",
    type: "event",
  },
  {
    inputs: [],
    name: "AUCTION_TIME",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INTEREST_SCALED",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "_accrue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "_accrueInterest",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "_bid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "_borrow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "_calculateExchangeRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "collateralToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "loanToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "oracle",
            type: "address",
          },
          {
            internalType: "address",
            name: "irm",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "ltv",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lth",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSupplyAssets",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSupplyShares",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalBorrowAssets",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalBorrowShares",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lastAccrued",
            type: "uint256",
          },
        ],
        internalType: "struct Pool",
        name: "pool",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "borrowShares",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "bidder",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bid",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
        ],
        internalType: "struct Position",
        name: "position",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "_calculateHealthFactor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "collateralToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "loanToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "oracle",
            type: "address",
          },
          {
            internalType: "address",
            name: "irm",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "ltv",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lth",
            type: "uint256",
          },
        ],
        internalType: "struct PoolParams",
        name: "poolParams",
        type: "tuple",
      },
    ],
    name: "_computeId",
    outputs: [
      {
        internalType: "Id",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "collateralToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "loanToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "oracle",
            type: "address",
          },
          {
            internalType: "address",
            name: "irm",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "ltv",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lth",
            type: "uint256",
          },
        ],
        internalType: "struct PoolParams",
        name: "poolParams",
        type: "tuple",
      },
    ],
    name: "_createPool",
    outputs: [
      {
        internalType: "Id",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC3156FlashBorrower",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "_flashLoan",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "_getPosition",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "_isPoolExist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
    ],
    name: "_repay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "irm",
        type: "address",
      },
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "_setInterestRateModel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "_setLTV",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "_setOperator",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "_settleAuction",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "_startAuction",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
    ],
    name: "_supply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
    ],
    name: "_supplyCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "_withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "_withdrawCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "_withdrawRoyalty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "accrueInterest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "bid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "borrow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "borrowAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeInSeconds",
        type: "uint256",
      },
    ],
    name: "calculateProjectedBorrowCost",
    outputs: [
      {
        internalType: "uint256",
        name: "interestCost",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentBorrowAPR",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "supplyAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeInSeconds",
        type: "uint256",
      },
    ],
    name: "calculateProjectedSupplyYield",
    outputs: [
      {
        internalType: "uint256",
        name: "projectedYield",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentAPR",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "checkAuctionEligibility",
    outputs: [
      {
        internalType: "bool",
        name: "isAuctionable",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "healthFactor",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minimumBidAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "collateralToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "loanToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "oracle",
            type: "address",
          },
          {
            internalType: "address",
            name: "irm",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "ltv",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lth",
            type: "uint256",
          },
        ],
        internalType: "struct PoolParams",
        name: "poolParams",
        type: "tuple",
      },
    ],
    name: "computeId",
    outputs: [
      {
        internalType: "Id",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "collateralToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "loanToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "oracle",
            type: "address",
          },
          {
            internalType: "address",
            name: "irm",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "ltv",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lth",
            type: "uint256",
          },
        ],
        internalType: "struct PoolParams",
        name: "poolParams",
        type: "tuple",
      },
    ],
    name: "createPool",
    outputs: [
      {
        internalType: "Id",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC3156FlashBorrower",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "flashLoan",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "getAPRBreakdown",
    outputs: [
      {
        internalType: "uint256",
        name: "dailyAPR",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "weeklyAPR",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "monthlyAPR",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "yearlyAPR",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getAuctionState",
    outputs: [
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentBid",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "currentBidder",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getCurrentBorrowAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getCurrentSupplyAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "getPoolAPRData",
    outputs: [
      {
        internalType: "uint256",
        name: "lendAPR",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "borrowAPR",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "utilizationRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalSupplyAssets",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalBorrowAssets",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "availableLiquidity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "exchangeRate",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isHealthy",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "getPoolRealtimeAPR",
    outputs: [
      {
        internalType: "uint256",
        name: "lendAPR",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "borrowAPR",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "utilizationRate",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getPosition",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getPositon",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "getSupplyExchangeRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserSupplyYieldInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "userSupplyShares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "userSupplyValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "projectedDailyYield",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "projectedYearlyYield",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentAPR",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "getUtilizationMetrics",
    outputs: [
      {
        internalType: "uint256",
        name: "currentUtilization",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "optimalUtilization",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "utilizationCategory",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "irm",
        type: "address",
      },
    ],
    name: "interestRateModels",
    outputs: [
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isPoolExist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
    ],
    name: "ltvs",
    outputs: [
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "operators",
    outputs: [
      {
        internalType: "bool",
        name: "isOperator",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "pools",
    outputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "address",
        name: "gauge",
        type: "address",
      },
      {
        internalType: "address",
        name: "bribe",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gaugePeriodReward",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gaugePeriodStart",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalSupplyAsset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalSupplyShare",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "activeBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feeAccrued",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastAccrued",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "positions",
    outputs: [
      {
        internalType: "uint256",
        name: "borrowShares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "bidder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "bid",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
    ],
    name: "repay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "irm",
        type: "address",
      },
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "setInterestRateModel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "setLTV",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setOperator",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "settleAuction",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "startAuction",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "supplies",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "supply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
    ],
    name: "supplyCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "supplyCollateralAndBorrow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "withdrawCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "withdrawRoyalty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as Abi;
