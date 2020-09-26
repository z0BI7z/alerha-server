import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { authRoutes, notificationRoutes, apiKeyRoutes } from "./routes";
import { databaseUrl } from "./config";
import { initIoInstance } from "./loaders";
import { errorHandler } from "./utils";

function createServer() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.use("/auth", authRoutes);

  app.use("/notification", notificationRoutes);

  app.use("/api-key", apiKeyRoutes);

  app.get("/", (req, res) => {
    res.status(200).json("Hey");
  });

  app.use((req, res) => {
    res.status(404).json({
      message: "Endpoint does not exist.",
    });
  });

  app.use(errorHandler);

  const server = app.listen(3001);

  return server;
}

async function main() {
  await mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  const server = createServer();

  const io = initIoInstance(server);

  io.on("connection", (socket) => {
    socket.on("initialize", (userId: string) => {
      console.log(`${userId} connected.`);
      socket.join(userId);
      socket.on("disconnect", () => {
        console.log(`${userId} disconnected.`);
      });
    });
  });
}

main();
