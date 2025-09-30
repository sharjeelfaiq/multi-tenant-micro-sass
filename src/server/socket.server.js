import { Server as SocketIOServer } from "socket.io";

import { env } from "#config/index.js";
import { httpServer } from "./app.js";

const { FRONTEND_URL } = env;

const createSocketServer = (httpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[connected] Socket (socket id: ${socket.id})`.socket);

    socket.on("connect_error", (error) => {
      console.error(
        `[connection_failed] Socket (error: ${error.message})`.error,
      );
    });

    socket.on("error", (error) => {
      console.error(`[runtime_error] Socket (error: ${error.message})`.error);
    });

    socket.on("disconnect", (reason) => {
      console.log(`[disconnected] Socket (reason: ${reason})`.socket);
    });
  });

  return io;
};

export const io = createSocketServer(httpServer);