import { CommandProps } from "@interfaces/commands";
import { parse } from "@utils/content";
import { sendMessage } from "@services/youtube";

const explain = async ({ broadcast }: CommandProps): Promise<void> =>
  await sendMessage(broadcast.chatId, parse("slnt.about"));

const extension = async ({ broadcast }: CommandProps): Promise<void> =>
  await sendMessage(broadcast.chatId, parse("slnt.extension"));

const commands = async ({ broadcast }: CommandProps): Promise<void> =>
  await sendMessage(broadcast.chatId, parse("slnt.commands"));

export default {
  slnt: explain,
  extension,
  commands,
  help: commands
};
