import { CommandHandlers } from "@interfaces/commands";
import defaultHandler from "./routes/default";
import customHandler from "./routes/custom";
import sessionHandler from "./routes/session";

const handlers: CommandHandlers = {
  ...defaultHandler,
  ...sessionHandler,
  ...customHandler
};

export default handlers;
