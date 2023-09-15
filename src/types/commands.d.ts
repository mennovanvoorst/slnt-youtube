import { Socket } from "socket.io-client";
import { Broadcast, Message } from "@interfaces/broadcast";

export interface CommandHandlers {
  [key: string]: (data) => void;
}

export interface CommandProps {
  broadcast: Broadcast;
  message: Message;
  socket: Socket;
}
