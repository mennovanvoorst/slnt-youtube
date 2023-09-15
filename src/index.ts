import express from "express";
import config from "./config";

const startServer = async (): Promise<void> => {
  const app = express();

  const { server } = await require("@loaders/index").default({
    expressApp: app
  });

  server
    .listen(config.port, () => {
      console.info(`Server listening on port ${config.port}`);
    })
    .on("error", (err: Error) => {
      console.error(err);
      process.exit(1);
    });
};

startServer();
