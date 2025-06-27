import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import { logger } from "../utils/log";

export function initializeCloudinary(): Promise<void> {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    logger.error("Missing Cloudinary credentials in environment variables");
    throw new Error("Missing Cloudinary credentials in environment variables");
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  });

  logger.success("Cloudinary initialized successfully");
  return Promise.resolve();
}

export async function uploadToCloudinary(buffer: Buffer, name: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "ens-images",
      public_id: `ens-${name.replace(/\./g, '-')}`,
      overwrite: true
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error: Error | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        if (!result?.secure_url) return reject(new Error("No URL returned from Cloudinary"));
        return resolve(result.secure_url);
      }
    );

    const readableStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      }
    });

    readableStream.pipe(uploadStream);
  });
}