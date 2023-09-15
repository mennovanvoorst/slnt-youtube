import { Command, Message, Sender } from "@interfaces/broadcast";

const channel = (message): string => message.channel.replace("#", "");

const sender = (message): Sender => ({
  username: message.authorDetails.displayName,
  isMod: message.authorDetails.isChatModerator,
  isSubscriber: message.authorDetails.isChatSponsor,
  isBroadcaster: message.authorDetails.isChatOwner
});

const command = (prefix: string, message: any): Command => {
  const isCommand = message.snippet.displayMessage.indexOf(prefix) === 0;

  const parsedMessage = isCommand
    ? message.snippet.displayMessage.slice(prefix.length).trim().split(" ")
    : [];
  const command = isCommand ? parsedMessage.shift() : "";

  return {
    isCommand,
    trigger: command.toLowerCase(),
    args: parsedMessage
  };
};

export default {
  channel,
  sender,
  command
};
