import { useEffect, useState } from "react";
import { decodeEventLog, getAddress, Log } from "viem";

import { pixcrossCuratorFactoryABI } from "@/lib/abis/pixcross-curator-factory.abi";
import { contractAddresses } from "@/lib/constants";
import { serializeBigInt } from "@/lib/helper/bigint";

export interface DecodedLogs {
  eventName: string;
  args: {
    curator: string;
    pools: string[];
    allocations: string[];
    [key: string]: any;
  };
}

const CURATOR_FACTORY_ADDRESSES = {
  11155111: contractAddresses?.[11155111]?.curatorFactory, // ETH
  84532: contractAddresses?.[84532]?.curatorFactory, // BASE
  421614: contractAddresses?.[421614]?.curatorFactory, // ARB
  43113: contractAddresses?.[43113]?.curatorFactory, // FUJI
} as const;

export const useCuratorEventLog = (logs?: Log, enabledLogs = false) => {
  const [decodedLogs, setDecodedLogs] = useState<DecodedLogs | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [chainIdFromLogs, setChainIdFromLogs] = useState<ChainSupported | null>(
    null,
  );

  useEffect(() => {
    if (!enabledLogs || !logs) {
      setDecodedLogs(null);
      setDecodeError(null);

      return;
    }

    try {
      const logList = normalizeLogsArray(logs);
      const factoryAddresses = getFactoryAddresses();
      const targetLog = findTargetLog(logList, factoryAddresses);

      if (!targetLog) {
        setDecodeError("No relevant logs found for PixcrossCuratorFactory");

        return;
      }

      const decoded = decodeLog(targetLog);
      const chainId = getChainIdFromAddress(targetLog.address);

      if (chainId) {
        setChainIdFromLogs(chainId);
      }

      if (decoded.eventName === "CuratorDeployed") {
        const processedLogs = processDecodedLogs(decoded, targetLog);

        setDecodedLogs(processedLogs);
        setDecodeError(null);
      } else {
        setDecodeError("Event not matched or missing expected args");
      }
    } catch {
      setDecodeError("Failed to decode transaction logs");
      setDecodedLogs(null);
    }
  }, [enabledLogs, logs]);

  return { decodedLogs, decodeError, chainIdFromLogs };
};

const normalizeLogsArray = (logs: Log): any[] => {
  if (Array.isArray(logs)) return logs;
  if ((logs as any).logs && Array.isArray((logs as any).logs)) {
    return (logs as any).logs;
  }

  return [logs];
};

const getFactoryAddresses = (): string[] => {
  return Object.values(CURATOR_FACTORY_ADDRESSES)
    .filter(Boolean)
    .map((addr) => addr!.toLowerCase());
};

const findTargetLog = (logList: any[], factoryAddresses: string[]) => {
  return logList.find((log: any) => {
    const logAddress = log?.address?.toLowerCase?.();

    return logAddress && factoryAddresses.includes(logAddress);
  });
};

const decodeLog = (targetLog: any) => {
  if (!Array.isArray(targetLog.topics)) {
    throw new Error("Invalid log format: 'topics' is not an array");
  }

  return decodeEventLog({
    abi: pixcrossCuratorFactoryABI,
    data: targetLog.data,
    topics: targetLog.topics,
  });
};

const getChainIdFromAddress = (address: string): ChainSupported | null => {
  const chainIdString = Object.keys(contractAddresses).find(
    (key) =>
      contractAddresses[
        key as unknown as ChainSupported
      ]?.curatorFactory?.toLowerCase() === address.toLowerCase(),
  );

  return chainIdString ? (chainIdString as unknown as ChainSupported) : null;
};

const processDecodedLogs = (decoded: any, targetLog: any): DecodedLogs => {
  const curatorAddress = getAddress(`0x${targetLog.topics[1].slice(26)}`);
  const serializedArgs = serializeBigInt(decoded.args);

  const safeGetArray = (obj: any, key: string): string[] => {
    return obj &&
      typeof obj === "object" &&
      key in obj &&
      Array.isArray(obj[key])
      ? obj[key]
      : [];
  };

  const additionalArgs =
    serializedArgs !== null && typeof serializedArgs === "object"
      ? Object.fromEntries(
          Object.entries(serializedArgs).filter(
            ([key]) => !["curator", "pools", "allocations"].includes(key),
          ),
        )
      : {};

  return {
    eventName: decoded.eventName,
    args: {
      curator: curatorAddress,
      pools: safeGetArray(serializedArgs, "pools"),
      allocations: safeGetArray(serializedArgs, "allocations"),
      ...additionalArgs,
    },
  };
};
