import { User } from "@interfaces/user";
import { getCache, setCache } from "@services/cache";

const save = async (user: User): Promise<void> =>
  await setCache(`user:${user.providers.youtube.id}`, user);

const get = async (channelId: string): Promise<User> =>
  await getCache(`user:${channelId}`);

export default {
  save,
  get
};
