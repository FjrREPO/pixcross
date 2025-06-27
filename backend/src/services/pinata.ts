import pinataSDK from "@pinata/sdk";
import { Readable } from "stream";
import { logger } from "../utils/log";

let pinata: any;

export function initializePinata(): Promise<void> {
  const { PINATA_JWT } = process.env;

  if (!PINATA_JWT) {
    throw new Error("PINATA_JWT is not defined in environment variables");
  }

  pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT });
  logger.success("Pinata initialized successfully");

  return Promise.resolve();
}

export async function uploadNFTMetadata(name: string, description: string, image: string): Promise<any> {
  try {
    const { PINATA_JWT } = process.env;

    if (!PINATA_JWT) {
      throw new Error("PINATA_JWT is not defined in environment variables");
    }

    const data = JSON.stringify({
      pinataContent: {
        name: name,
        description: description,
        image: image,
        attributes: [
          {
            trait_type: "Name",
            value: name
          },
          {
            trait_type: "Description",
            value: description
          },
          {
            trait_type: "Type",
            value: "IP (Intellectual Property)"
          }
        ]
      },
      pinataMetadata: {
        name: `${name}-${Date.now()}.json`,
      }
    })
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: data,
    });

    const resData = await res.json();

    if (!res.ok) {
      logger.error("Failed to upload metadata to IPFS:", resData);
    }

    return resData;
  } catch (error) {
    logger.error("Error uploading metadata to IPFS:", error);
    throw new Error("IPFS metadata upload failed");
  }
}

export async function uploadImageToIPFS(buffer: Buffer, name = "image"): Promise<string> {
  try {
    logger.info("Uploading image buffer to IPFS");

    const stream = Readable.from(buffer);

    const resData = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: `${name}-${Date.now()}.jpg`,
      },
      pinataOptions: {
        cidVersion: 1,
      }
    });

    return resData.IpfsHash;
  } catch (error) {
    logger.error("Error uploading image to IPFS:", error);
    throw new Error("IPFS image upload failed");
  }
}
