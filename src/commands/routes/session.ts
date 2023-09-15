import { CommandProps } from "@interfaces/commands";
import { parse } from "@utils/content";
import { getSession, sessionAddRequest } from "@services/session";
import { sendMessage } from "@services/youtube";
import message from "@models/message";

const sessionLink = async ({ broadcast }: CommandProps): Promise<void> => {
  const session = await getSession(broadcast.userId);

  if (!session || !session.isActive) {
    await sendMessage(
      broadcast.chatId,
      parse("session.inactive", { channel: broadcast.username })
    );

    return;
  }

  await sendMessage(
    broadcast.chatId,
    parse("session.link", { sessionId: broadcast.userId })
  );
};

const currentSong = async ({ broadcast }: CommandProps): Promise<void> => {
  const session = await getSession(broadcast.userId);

  if (!session || !session.isActive) {
    await sendMessage(
      broadcast.chatId,
      parse("session.inactive", { channel: broadcast.username })
    );

    return;
  }

  const video = session.playlist[0];

  if (video)
    await sendMessage(
      broadcast.chatId,
      parse("session.nowPlaying", {
        title: video.title,
        channel: video.channel
      })
    );
  else await sendMessage(broadcast.chatId, parse("session.nothingPlaying"));
};

const addRequest = async ({
  broadcast,
  message
}: CommandProps): Promise<void> => {
  const session = await getSession(broadcast.userId);

  if (!session || !session.isActive) {
    await sendMessage(
      broadcast.chatId,
      parse("session.inactive", { channel: broadcast.username })
    );

    return;
  }

  await sessionAddRequest(session, message, broadcast);
};

export default {
  session: sessionLink,
  song: currentSong,
  sr: addRequest,
  songrequest: addRequest
};
