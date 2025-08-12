import dotenv from "dotenv";
import app from "./app";
import { connectDB, disconnectDB } from "./config/db";
import { Logger } from "./utils/logger";

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;

let server: ReturnType<typeof app.listen>;

// Start the server
async function startServer() {
  try {
    await connectDB(MONGO_URI);
    server = app.listen(PORT, () => {
      Logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    Logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Shutdown the server
async function shutdown(signal: string) {
  Logger.info(`Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      Logger.info("Server closed.");
      await disconnectDB();
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
  setTimeout(() => {
    Logger.error("Server shutdown due to timed out.");
    process.exit(1);
  }, 10000);
}

// Handle termination signals
["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  Logger.error("Uncaught Exception:", err);
  shutdown("uncaughtException");
});

// Handle unhandled rejections
process.on("unhandledRejection", (reason) => {
  Logger.error("Unhandled Rejection:", reason);
  shutdown("unhandledRejection");
});

startServer();
