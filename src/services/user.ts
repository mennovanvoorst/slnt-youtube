import user from "@models/user";
import { User } from "@interfaces/user";

export const updateUser = async (usr: User): Promise<void> =>
  await user.save(usr);

export const getUser = async (channelId: string): Promise<User> =>
  await user.get(channelId);
