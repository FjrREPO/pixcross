import fileUpload from "express-fileupload";

declare global {
  namespace Express {
    interface Request {
      files?: fileUpload.FileArray | null | undefined;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      CLOUDINARY_CLOUD_NAME?: string;
      CLOUDINARY_API_KEY?: string;
      CLOUDINARY_API_SECRET?: string;
      PRIVATE_KEY?: string;
      CONTRACT_ADDRESS?: string;
      PINATA_JWT?: string;
      NODE_ENV?: string;
    }
  }
}

export interface PNSMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface IPFSUploadResult {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}