import { Router } from "express";
import user from "./user";
import { Socket } from "socket.io-client";

export default (socket: Socket): Router => {
  const app = Router();

  user(app, socket);

  return app;
};
