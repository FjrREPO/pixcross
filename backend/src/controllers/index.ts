import type { Request, Response } from "express";
import {
  generateMetadata,
  uploadImageToIPFS,
  uploadNFTMetadata,
} from "../services";
import { logger } from "../utils/log";
import path from "path";
import fs from "fs";

// Helper function to generate IPFS without response handling
async function generateIPFSHelper(name: string): Promise<{ metadataURI: string; name: string }> {
  let description: string;
  let imagePath: string;
  let displayName: string;

  if (name.toLowerCase() === "bayc") {
    imagePath = path.join(__dirname, "../images/BAYC.jpg");
    displayName = "Bored Ape Yacht Club";
    description = "Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs, each with distinct traits and characteristics.";
  } else if (name.toLowerCase() === "pudgy" || name.toLowerCase() === "ppg") {
    imagePath = path.join(__dirname, "../images/PUDGY.jpg");
    displayName = "Pudgy Penguins";
    description = "Pudgy Penguins is a collection of 8,888 unique penguin NFTs, each with its own personality and style.";
  } else if (name.toLowerCase() === "azuki") {
    imagePath = path.join(__dirname, "../images/AZUKI.jpg");
    displayName = "Azuki";
    description = "Azuki is a collection of 10,000 unique anime-style NFTs, each with its own story and background.";
  } else if (name.toLowerCase() === "cool-cats" || name.toLowerCase() === "cool cats") {
    imagePath = path.join(__dirname, "../images/COOL_CATS.jpg");
    displayName = "Cool Cats";
    description = "Cool Cats is a collection of 9,999 unique cat NFTs, each with its own cool traits and accessories.";
  } else if (name.toLowerCase() === "cryptopunks") {
    imagePath = path.join(__dirname, "../images/CRYPTOPUNKS.png");
    displayName = "CryptoPunks";
    description = "CryptoPunks is a collection of 10,000 unique 24x24 pixel art characters, each with its own distinct features.";
  } else if (name.toLowerCase() === "doodles") {
    imagePath = path.join(__dirname, "../images/DOODLES.png");
    displayName = "Doodles";
    description = "Doodles is a collection of 10,000 unique hand-drawn NFTs, each with its own vibrant colors and traits.";
  } else if (name.toLowerCase() === "lazy-lions" || name.toLowerCase() === "lazy lions") {
    imagePath = path.join(__dirname, "../images/LAZY_LIONS.png");
    displayName = "Lazy Lions";
    description = "Lazy Lions is a collection of 6,000 unique lion NFTs, each with its own lazy and relaxed traits.";
  } else if (name.toLowerCase() === "lil-pudgys" || name.toLowerCase() === "lil pudgys") {
    imagePath = path.join(__dirname, "../images/LIL_PUDGYS.jpg");
    displayName = "Lil Pudgys";
    description = "Lil Pudgys is a collection of 6,000 unique baby penguin NFTs, each with its own adorable traits.";
  } else if (name.toLowerCase() === "mayc") {
    imagePath = path.join(__dirname, "../images/MAYC.png");
    displayName = "Mutant Ape Yacht Club";
    description = "Mutant Ape Yacht Club is a collection of 20,000 unique mutant apes, each with its own distinct traits and characteristics.";
  } else if (name.toLowerCase() === "milady-maker" || name.toLowerCase() === "milady maker") {
    imagePath = path.join(__dirname, "../images/MILADY_MAKER.jpg");
    displayName = "Milady Maker";
    description = "Milady Maker is a collection of 10,000 unique anime-style NFTs, each with its own story and background.";
  } else if (name.toLowerCase() === "mocaverse") {
    imagePath = path.join(__dirname, "../images/MOCAVERSE.png");
    displayName = "Mocaverse";
    description = "Mocaverse is a collection of 8,888 unique NFTs, each representing a different character in the Mocaverse universe.";
  } else if (name.toLowerCase() === "moonbirds") {
    imagePath = path.join(__dirname, "../images/MOONBIRDS.jpg");
    displayName = "Moonbirds";
    description = "Moonbirds is a collection of 10,000 unique owl NFTs, each with its own distinct traits and characteristics.";
  } else {
    throw new Error(`Unsupported name: ${name}. Please use one of the predefined names.`);
  }

  logger.info("Uploading image buffer to IPFS");
  const imageBuffer = fs.readFileSync(imagePath);

  const uploadedImage = await uploadImageToIPFS(imageBuffer, displayName);
  const image = `ipfs://${uploadedImage}`;

  const metadata = generateMetadata(
    displayName,
    description,
    image
  );

  const uploadResult = await uploadNFTMetadata(
    metadata.name,
    metadata.description,
    metadata.image
  );

  logger.success("Uploaded metadata to IPFS:", JSON.stringify(uploadResult, null, 2));

  return {
    metadataURI: `ipfs://${uploadResult.IpfsHash}`,
    name: displayName
  };
}

export async function generateIPFSController(req: Request, res: Response): Promise<void> {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      res.status(400).json({ error: "Name is required as a string" });
      return;
    }

    const result = await generateIPFSHelper(name);
    res.json(result);
  } catch (error) {
    logger.error("Error generating IPFS:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to generate IPFS",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
}

export async function generateAllIPFSController(req: Request, res: Response): Promise<void> {
  try {
    const pnsList = [
      "BAYC",
      "PPG",
      "Azuki",
      "Cool Cats",
      "CryptoPunks",
      "Doodles",
      "Lazy Lions",
      "Lil Pudgys",
      "MAYC",
      "Milady Maker",
      "Mocaverse",
      "Moonbirds"
    ];

    const results = await Promise.all(
      pnsList.map(async (name) => {
        try {
          return await generateIPFSHelper(name);
        } catch (error) {
          logger.error(`Error generating IPFS for ${name}:`, error);
          return {
            name,
            error: error instanceof Error ? error.message : "Unknown error"
          };
        }
      })
    );

    res.json({
      success: true,
      results
    });
  } catch (error) {
    logger.error("Error generating all PNS:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to generate all PNS",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
}
