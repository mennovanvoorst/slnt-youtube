import { Settings } from "@interfaces/settings";
import settings from "@models/settings";
import { updateTimedMessages } from "@services/timedMessages";
import { joinSession, leaveSession } from "../sockets/services/session";
import { Socket } from "socket.io-client";
import { addBroadcast, deleteBroadcast } from "@services/youtube";

export const updateSettings = async (
  socket: Socket,
  channel: any,
  s: Settings
): Promise<void> => {
  await settings.save(channel.id, s);
  //await updateTimedMessages(channel.displayName, s.settings.bot_timedmessages);

  if (s.settings.bot_enabled) {
    await addBroadcast({
      userId: s.user_id,
      username: channel.displayName,
      channel: channel.id,
      isLive: false,
      chatId: "",
      messages: null
    });

    joinSession(socket, s.user_id);
  } else {
    await deleteBroadcast(channel.id);

    leaveSession(socket, s.user_id);
  }
};

export const getSettings = async (channel: string): Promise<any> =>
  await settings.get(channel);
