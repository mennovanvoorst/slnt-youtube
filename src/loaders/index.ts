import { Application } from "express";
import { Server } from "http";
import oauthLoader from "./oauth";
import youtubeLoader from "./youtube";
import socketioLoader from "./socketio";
import expressLoader from "./express";

export default async ({
  expressApp
}: {
  expressApp: Application;
}): Promise<{ server: Server }> => {
  const socket = await socketioLoader();
  const server: Server = await expressLoader({
    app: expressApp,
    socket
  });
  await oauthLoader({ app: expressApp });
  await youtubeLoader({ socket });

  return { server };
};
