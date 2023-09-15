import { io, Socket } from "socket.io-client";
import socketHandlers from "@sockets";
import socket from "@services/sockets";

export default (): Socket => {
  console.info("Socket.IO client has been initialized");

  socket.on("action", (action) => {
    const eventHandler = socketHandlers[action.type];

    if (eventHandler) {
      eventHandler({
        payload: action.payload
      });
    }
  });

  return socket;
};
