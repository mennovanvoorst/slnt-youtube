import { getCache, setCache } from "@services/cache";
import { ScheduledTask } from "node-cron";

const save = async (
  channel: string,
  messages: ScheduledTask[]
): Promise<void> => await setCache(`timed_messages:${channel}`, messages);

const get = async (channel: string): Promise<ScheduledTask[]> =>
  await getCache(`timed_messages:${channel}`);

export default {
  save,
  get
};
