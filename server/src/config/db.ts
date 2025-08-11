import mongoose from "mongoose";
import { Logger } from "../utils/logger";

// convert to number functions
const toNumber = (v: string | undefined, fallback: number) =>
  v ? Number(v) : fallback;

// connections options variables
const DEFAULT_MAX_POOL = toNumber(process.env.MONGO_POOL_SIZE, 20);
const DEFAULT_SERVER_SELECTION_TIMEOUT = toNumber(
  process.env.MONGO_SERVER_SELECTION_TIMEOUT,
  5000
);
const DEFAULT_SOCKET_TIMEOUT = toNumber(
  process.env.MONGO_SOCKET_TIMEOUT,
  45000
);
const MAX_CONNECT_ATTEMPTS = toNumber(process.env.MONGO_CONNECT_RETRIES, 5);

/**
 * connectDB
 * - Connects to MongoDB (Mongoose)
 * - Adds event listeners for logging
 * - Implements simple retry/backoff on initial connect
 */

export async function connectDB(uri: string) {
  if (!uri) {
    Logger.error("Database URI is not provided");
    throw new Error("Mongo URI is missing");
  }

  const options: mongoose.ConnectOptions = {
    maxPoolSize: DEFAULT_MAX_POOL,
    serverSelectionTimeoutMS: DEFAULT_SERVER_SELECTION_TIMEOUT,
    socketTimeoutMS: DEFAULT_SOCKET_TIMEOUT,
    family: 4,
    autoIndex: process.env.NODE_ENV === "production" ? false : true,
  };

  let attemps = 0;

  const connectWithRetry = async (): Promise<mongoose.Connection> => {
    try {
      attemps++;
      Logger.info(`Attempting to connect to MongoDB (Attempt ${attemps})`);
      await mongoose.connect(uri, options);
      const conn = mongoose.connection;

      conn.on("connected", () =>
        Logger.info("Database Connected Successfully!")
      );
      conn.on("error", (err) =>
        Logger.error("Error in Database Connection", err)
      );
      conn.on("disconnected", () => Logger.warn("Database Disconnected"));
      conn.on("reconnected", () => Logger.info("Database Reconnected"));

      Logger.info("Connected to MongoDB successfully");
      return conn;
    } catch (err: any) {
      Logger.error(`Failed to connect to MongoDB: ${err.message}`);
      if (attemps > MAX_CONNECT_ATTEMPTS) {
        Logger.error("Max connection attempts reached. Exiting...");
        process.exit(1);
      }
      const backoffMs = Math.min(1000 * 2 ** attemps, 30000);
      Logger.info(`Retrying MongoDB connection in ${backoffMs}ms`);
      await new Promise((r) => setTimeout(r, backoffMs));
      return connectWithRetry();
    }
  };
  return connectWithRetry();
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    Logger.info("Database Disconnected Successfully!");
  } catch (err: any) {
    Logger.error(`Failed to disconnect from MongoDB: ${err.message}`);
  }
}

export function getDBConnection(): mongoose.Connection {
  return mongoose.connection;
}
