import mongoose from "mongoose";

import { commonUtils } from "#utils/index.js";
import { env } from "./env.config.js";

let isConnected = false;

const { asyncHandler } = commonUtils;

const { DATABASE_URI, DATABASE_NAME } = env;

const DB_CONNECTION_STRING = `${DATABASE_URI}/${DATABASE_NAME}`;

export const connectDatabase = asyncHandler(async () => {
  if (isConnected) {
    console.log("Using existing Database connection");
    return;
  }

  const connection = await mongoose.connect(DB_CONNECTION_STRING, {
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = !!connection.connections[0].readyState;
  console.log(`[connected] Database (url: ${DB_CONNECTION_STRING})`);

  const db = mongoose.connection;

  db.on("disconnected", () => {
    console.log("[disconnected] Database");

    isConnected = false;
  });

  process.on("SIGINT", async () => {  
    await db.close();

    console.log("[connection_closed] Database");

    process.exit(0);
  });

  db.on("error", (error) => {
    console.error(
      `[connection_failed] Database (error: ${error.message})`,
    );

    process.exit(1);
  });
});
