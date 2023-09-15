import { Router } from "express";
import { updateSettings } from "@services/settings";
import { Socket } from "socket.io-client";

const route = Router();

export default (app: Router, socket: Socket): void => {
  app.use("/v1/user", route);

  route.post("/settings", async (req, res) => {
    const { channelId, settings } = req.body;

    await updateSettings(socket, channelId, settings);

    return res.sendStatus(200);
  });
};
