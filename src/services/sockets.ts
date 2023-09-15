import { io, Socket } from "socket.io-client";
import config from "@config";

const socket = io(config.server_url, {
  withCredentials: true
});

export const emitToSession = (type: string, payload: any): void => {
  socket.emit("action", {
    type,
    payload
  });
};

export default socket;
