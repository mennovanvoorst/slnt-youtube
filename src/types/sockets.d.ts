export interface Action {
  type: string;
  sessionId?: number;
  payload: any;
}

export interface EventHandlers {
  [key: string]: (payload, dispatch?) => void;
}

declare module "node:http" {
  interface IncomingMessage {
    session: any;
  }
}
