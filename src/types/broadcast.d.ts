export interface Broadcast {
  userId: number;
  channel: string;
  username: string;
  isLive: boolean;
  chatId: string;
  messages: Message[] | null;
}

export interface Message {
  message: string;
  sender: Sender;
  command: Command;
  send: Date;
}

export interface Sender {
  username: string;
  isMod: boolean;
  isSubscriber: boolean;
  isBroadcaster: boolean;
}

export interface Command {
  isCommand: boolean;
  trigger: string;
  args: string[];
}
