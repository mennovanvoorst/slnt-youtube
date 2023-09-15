import { EventHandlers } from "@interfaces/sockets";
import sessionHandler from "./routes/session";

const handlers: EventHandlers = {
  ...sessionHandler
};

export default handlers;
