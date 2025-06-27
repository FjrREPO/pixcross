import type { Application } from "express"
import { 
  generateAllIPFSController,
  generateIPFSController,
} from "./controllers";

export function setupRoutes(app: Application): void {
  app.post("/generate", generateIPFSController);
  app.post("/generate-all", generateAllIPFSController);

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });
}