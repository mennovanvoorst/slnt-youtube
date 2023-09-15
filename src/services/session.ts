import { Session } from "@interfaces/session";
import session from "@models/session";
import { sendMessage } from "@services/youtube";
import { parse } from "@utils/content";
import { Broadcast, Message } from "@interfaces/broadcast";
import { getSettings } from "@services/settings";
import { differenceInSeconds } from "date-fns";
import { isVideo } from "@utils/youtube";
import { fetchVideo } from "@api/video";
import { addNewRequest } from "../sockets/services/session";

export const updateSession = async (ses: Session): Promise<void> =>
  await session.save(ses);

export const getSession = async (sessionId: number): Promise<Session> =>
  await session.get(sessionId);

export const sessionAddRequest = async (
  ses: Session,
  message: Message,
  broadcast: Broadcast
): Promise<void> => {
  if (!message.command.args || message.command.args.length === 0) {
    await sendMessage(broadcast.chatId, parse("session.requestMissing"));
    return;
  }

  const settings = await getSettings(broadcast.channel);
  const requestSettings = settings.settings.song_requests;

  let hasPermission = false;
  let curPermission = null;

  if (requestSettings.chat_enabled) {
    if (requestSettings.mode === "priority") {
      hasPermission = requestSettings.priority.some((priority) => {
        curPermission = priority;

        switch (priority) {
          case "moderator":
            return message.sender.isMod;
          case "subscriber":
            return message.sender.isSubscriber;
          case "streamer":
            return message.sender.isBroadcaster;
          case "viewer":
            return true;
        }
      });
    }

    if (!hasPermission) {
      await sendMessage(broadcast.chatId, parse("session.requestDisabled"));
      return;
    }
  }

  let requests = broadcast.messages.filter(
    (message) => message.command.trigger === "sr"
  );

  requests.pop();

  requests = requests.filter(
    (request) => request.sender.username === message.sender.username
  );

  const lastRequest = requests.at(-1);
  const timeBetweenRequests = lastRequest
    ? differenceInSeconds(new Date(), lastRequest.send)
    : 0;
  const timeout = requestSettings.cooldown[curPermission];

  console.log(lastRequest);

  if (timeout > 0 && timeBetweenRequests && timeBetweenRequests <= timeout) {
    const params = {
      user: message.sender.username,
      seconds: timeout - timeBetweenRequests
    };

    await sendMessage(broadcast.chatId, parse("session.requestLimit", params));
    return;
  }

  const videoId = isVideo(message.command.args[0]);

  if (!videoId) {
    await sendMessage(broadcast.chatId, parse("session.requestInvalid"));
    return;
  }

  const res = await fetchVideo(videoId);

  if (!res.success) {
    await sendMessage(broadcast.chatId, parse("session.requestFailed"));
    return;
  }

  const video = res.payload;
  video.priority = curPermission;

  addNewRequest(ses.hosts[0], video);
  await sendMessage(
    broadcast.chatId,
    parse("session.requestAdded", {
      title: video.title,
      channel: video.channel
    })
  );
};
