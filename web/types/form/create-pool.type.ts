import { z } from "zod";

import { chainData } from "@/data/chains.data";

export type ChainData = {
  chainId: number;
  chainIdSelector: string;
  name: string;
  ccipName: string;
  symbol: string;
  icon: string;
  explorer: string;
};

export enum SupportedChainId {
  ETHEREUM_SEPOLIA = 11155111,
  BASE_SEPOLIA = 84532,
  ARBITRUM_SEPOLIA = 421614,
  AVALANCHE_FUJI = 43113,
}

export type ChainSupported = SupportedChainId;

const supportedChainIds = Object.values(SupportedChainId).filter(
  (value) => typeof value === "number",
) as number[];

export const createPoolSchema = z
  .object({
    chainId: z.number().refine((val) => supportedChainIds.includes(val), {
      message: "Please select a supported blockchain network",
    }),

    loanToken: z
      .string()
      .min(1, "Loan token is required")
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid loan token address format"),

    collateralToken: z
      .string()
      .min(1, "Collateral token is required")
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid collateral token address format"),

    collateralChainId: z
      .number()
      .refine((val) => supportedChainIds.includes(val), {
        message: "Invalid collateral chain ID",
      })
      .optional(),

    irmModel: z.string().min(1, "Interest rate model is required"),

    oracleProvider: z.string().min(1, "Oracle provider is required"),

    ltv: z
      .number()
      .min(1, "LTV must be at least 1%")
      .max(95, "LTV cannot exceed 95%")
      .multipleOf(0.01, "LTV must be a valid percentage"),

    lth: z
      .number()
      .min(1, "LTH must be at least 1%")
      .max(98, "LTH cannot exceed 98%")
      .multipleOf(0.01, "LTH must be a valid percentage"),

    description: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional(),
  })
  .refine((data) => data.lth > data.ltv, {
    message: "Liquidation threshold must be higher than LTV ratio",
    path: ["lth"],
  });

export type CreatePoolType = z.infer<typeof createPoolSchema>;

export interface IrmModel {
  id: string;
  name: string;
  description: string;
  category: "Linear" | "Kinked" | "Adaptive" | "Custom";
  baseRate: string;
  optimalUtilization: string;
  maxRate: string;
  riskLevel: "Low" | "Medium" | "High";
  supportedChains: SupportedChainId[];
  isActive: boolean;
  parameters: {
    slope1?: string;
    slope2?: string;
    kink?: string;
  };
}

export interface OracleProvider {
  id: string;
  name: string;
  description: string;
  provider: "Chainlink" | "Band" | "Pyth" | "Custom";
  updateFrequency: string;
  accuracy: string;
  riskLevel: "Low" | "Medium" | "High";
  supportedChains: SupportedChainId[];
  supportedAssets: string[];
  isActive: boolean;
  latency: string;
  cost: "Free" | "Low" | "Medium" | "High";
}

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  isValid: boolean;
  isCompleted: boolean;
  icon?: string;
  estimatedTime?: string;
}

export interface TokenData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: SupportedChainId;
  icon?: string;
  isActive: boolean;
  category: "Stablecoin" | "Governance" | "Utility" | "Wrapped" | "Other";
  riskScore: number;
}

export interface NFTCollectionData {
  address: string;
  name: string;
  symbol: string;
  chainId: SupportedChainId;
  icon?: string;
  floorPrice?: string;
  totalSupply?: number;
  isActive: boolean;
  category: "Art" | "Gaming" | "Utility" | "Collectible" | "Other";
  riskScore: number;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StepValidationConfig {
  [stepId: number]: {
    requiredFields: (keyof CreatePoolType)[];
    customValidators?: ((
      data: Partial<CreatePoolType>,
    ) => FormValidationResult)[];
  };
}

export const stepValidationConfig: StepValidationConfig = {
  0: {
    requiredFields: ["chainId"],
  },
  1: {
    requiredFields: ["loanToken", "collateralToken"],
  },
  2: {
    requiredFields: ["irmModel", "oracleProvider"],
  },
  3: {
    requiredFields: ["ltv", "lth"],
    customValidators: [
      (data) => ({
        isValid: (data.lth || 0) > (data.ltv || 0),
        errors:
          (data.lth || 0) <= (data.ltv || 0)
            ? ["LTH must be higher than LTV"]
            : [],
        warnings: [],
      }),
    ],
  },
};

export type HexAddress = `0x${string}`;

export interface TransactionLog {
  address: HexAddress;
  topics: string[];
  data: string;
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
}

export interface CreatePoolTransaction {
  hash: HexAddress;
  chainId: SupportedChainId;
  status: "pending" | "confirmed" | "failed";
  blockNumber?: number;
  gasUsed?: string;
  logs?: TransactionLog[];
}

export interface CreatePoolResponse {
  success: boolean;
  poolId?: string;
  transaction?: CreatePoolTransaction;
  error?: string;
}

export type FormStep = 0 | 1 | 2 | 3;

export interface FormState {
  currentStep: FormStep;
  completedSteps: FormStep[];
  isSubmitting: boolean;
  hasUnsavedChanges: boolean;
}

export const isValidChainId = (
  chainId: number,
): chainId is SupportedChainId => {
  return supportedChainIds.includes(chainId);
};

export const getChainById = (chainId: number): ChainData | undefined => {
  return chainData.find((chain) => chain.chainId === chainId);
};

export const isValidAddress = (address: string): address is HexAddress => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
