import { TimedMessage } from "@interfaces/timedMessage";
import cron, { ScheduledTask } from "node-cron";
import timedMessage from "@models/timedMessage";
import { getBroadcast, sendMessage } from "@services/youtube";
import { Broadcast } from "@interfaces/broadcast";

export const updateTimedMessages = async (
  broadcast: Broadcast,
  messages: TimedMessage[]
): Promise<void> => {
  let cronjobs: ScheduledTask[] =
    (await timedMessage.get(broadcast.channel)) || [];

  if (cronjobs && cronjobs.length > 0) {
    cronjobs.forEach((job) => {
      job.stop();
    });

    cronjobs = [];
  }

  for (const timedMessage of messages) {
    const { enabled, messages_between, interval, message } = timedMessage;

    if (!enabled) continue;

    const intervalTime =
      interval > 60 ? `* */${interval / 60} * * *` : `*/${interval} * * * *`;

    const job = cron.schedule(intervalTime, async () => {
      const curBroadcast = await getBroadcast(broadcast.channel);
      const chatMessages = curBroadcast.messages || [];
      const lastMessagesFromLog = chatMessages.slice(-messages_between);

      if (
        lastMessagesFromLog.filter((msg: any) => msg.message === message)
          .length > 0
      )
        return;

      await sendMessage(broadcast.chatId, message);
    });

    cronjobs = [...cronjobs, job];
  }

  await timedMessage.save(broadcast.channel, cronjobs);
};
