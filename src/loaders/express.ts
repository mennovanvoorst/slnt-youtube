import { Application } from "express";
import { createServer, Server } from "http";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import config from "@config";
import cors from "cors";
import { Socket } from "socket.io-client";
import routes from "@routes";

export default ({
  app,
  socket
}: {
  app: Application;
  socket: Socket;
}): Server => {
  app.use(cookieParser());

  app.use(
    cors({
      origin: [config.app_url, config.extension_url],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true
    })
  );

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.use("/youtube", routes(socket));

  return createServer(app);
};
