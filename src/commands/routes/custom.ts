import { CommandProps } from "@interfaces/commands";
import { getSettings } from "@services/settings";
import { sendMessage } from "@services/youtube";

const custom = async ({ broadcast, message }: CommandProps): Promise<void> => {
  const commands = await getSettings(broadcast.channel);
  const event = commands.settings.bot_commands.find(
    (c) => c.trigger === message.command.trigger
  );

  if (!event || !event.enabled) return;

  await sendMessage(broadcast.chatId, event.message);
};

export default {
  custom
};
