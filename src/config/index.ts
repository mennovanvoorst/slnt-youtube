import dotenv from "dotenv";
import { Config } from "@interfaces/config";

dotenv.config();

const config: Config = {
  app_url: process.env.APP_URL as string,
  server_url: process.env.SERVER_URL as string,
  bot_url: process.env.BOT_URL as string,
  port: process.env.NODE_PORT as string,

  api: {
    prefix: process.env.API_PREFIX as string
  },

  youtube: {
    key: process.env.YOUTUBE_KEY as string,
    client: process.env.YOUTUBE_CLIENT as string,
    secret: process.env.YOUTUBE_SECRET as string,
    auth: process.env.YOUTUBE_AUTH_CODE as string
  }
};

export default config;
