import { getCache, setCache } from "@services/cache";
import { Settings } from "@interfaces/settings";

const save = async (channel: string, settings: Settings): Promise<void> =>
  await setCache(`settings:${channel}`, settings);

const get = async (channel: string): Promise<void> =>
  await getCache(`settings:${channel}`);

export default {
  save,
  get
};
