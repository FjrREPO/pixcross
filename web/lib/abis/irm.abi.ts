import { Abi } from "viem";

export const irmABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rate",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "",
        type: "bytes32",
      },
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
        name: "",
        type: "tuple",
      },
    ],
    name: "getBorrowRate",
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
    name: "rate",
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
] as Abi;
