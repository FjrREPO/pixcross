import * as dotenv from "dotenv";
import express from "express";
import { setupRoutes } from "./routes";
import { logger } from "./utils/log";
import cors from "cors";
import { initializeServices } from "./services";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

initializeServices();

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
setupRoutes(app);

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    logger.success(`Server is running on http://localhost:${port}`);
  });
}

export default app;