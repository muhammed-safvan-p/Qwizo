import express, { type Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { notFoundHandler } from "./shared/presentation/middlewares/notFoundHandler.js";
import { errorHandler } from "./shared/presentation/middlewares/errorHandler.js";

const app: Application = express();

// Middlewares
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running fine.",
  });
});

// 404 handler for undefined routes
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
