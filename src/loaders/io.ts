import socketio from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";

let io: socketio.Server;

export function initIoInstance(server: HttpServer | HttpsServer) {
  io = socketio(server);
  return io;
}

export function getIoInstance() {
  if (!io) {
    throw Error("Io not initialized.");
  }

  return io;
}
