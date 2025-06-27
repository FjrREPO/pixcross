import { logger } from "../utils/log";
import { initializeCloudinary } from "./cloudinary";
import { initializePinata } from "./pinata";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Initialization timeout")), ms);
    promise.then((val) => {
      clearTimeout(timer);
      resolve(val);
    }).catch((err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

export async function initializeServices(): Promise<void> {
  console.clear();
  logger.info("Initializing services...");

  await Promise.all([
    withTimeout(initializeCloudinary(), 3000),
    // withTimeout(initializeEthereumProvider(), 3000),
    withTimeout(initializePinata(), 3000),
  ]);

  logger.success("All services initialized successfully");
}


export * from "./cloudinary";
export * from "./pinata";
export * from "./nft";