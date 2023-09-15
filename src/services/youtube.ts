import { getCache, setCache } from "@services/cache";
import axios from "axios";
import { parse } from "node-html-parser";
import config from "@config";
import { Broadcast, Message } from "@interfaces/broadcast";
import message from "@models/message";
import { google } from "googleapis";
import { googleClient } from "@loaders/oauth";
import { channel } from "diagnostics_channel";

const chatListeners = {};

export const getBroadcasts = async (): Promise<Broadcast[]> =>
  await getCache(`broadcasts`);

export const getBroadcast = async (channel: string): Promise<Broadcast> => {
  const res = await getCache(`broadcasts`);
  return res.find((broadcast) => broadcast.channel === channel);
};

export const addBroadcast = async (broadcast: Broadcast): Promise<void> => {
  const broadcasts = (await getBroadcasts()) || [];
  await setCache("broadcasts", [...broadcasts, broadcast]);
};

export const deleteBroadcast = async (channel: string): Promise<void> => {
  let broadcasts = (await getBroadcasts()) || [];
  broadcasts = broadcasts.filter((b) => b.channel === channel);

  await setCache("broadcasts", broadcasts);
};

export const updateBroadcast = async (broadcast: Broadcast): Promise<void> => {
  const broadcasts = (await getBroadcasts()) || [];
  const broadcastIndex = broadcasts.findIndex(
    (stream) => stream.channel === broadcast.channel
  );

  broadcasts[broadcastIndex] = broadcast;

  await setCache("broadcasts", broadcasts);
};

export const sendMessage = async (
  chatId: string,
  message: string
): Promise<void> => {
  try {
    const service = google.youtube({
      version: "v3",
      auth: googleClient
    });

    await service.liveChatMessages.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          liveChatId: chatId,
          type: "textMessageEvent",
          textMessageDetails: {
            messageText: message
          }
        }
      }
    });
  } catch (e) {
    removeBroadcastByChatId(chatId);
    console.log(e.response);
  }
};

export const getBroadcastFromChannel = async (
  channel: string
): Promise<string | null> => {
  const res = await axios.get(
    `https://www.youtube.com/channel/${channel}/live`,
    {
      headers: {
        Cookie:
          "CONSENT=YES+srp.gws-20211208-0-RC2.en+FX+309; YSC=Kw9uF0Dh_E8; VISITOR_INFO1_LIVE=SrzhEbj3CpU; GPS=1"
      }
    }
  );

  const html = parse(res.data);

  const canonicalURLTag = html.querySelector("link[rel=canonical]");

  const canonicalURL = canonicalURLTag.getAttribute("href");
  const isStreaming = canonicalURL.includes("/watch?v=");

  if (!isStreaming) return null;

  const videoRegex = /v=([^&#]{5,})/;
  const videoId = canonicalURL.match(videoRegex)[1];

  return videoId;
};

export const getLiveChatIdFromVideoId = async (
  videoId: string
): Promise<string | null> => {
  const res = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
    params: {
      part: "liveStreamingDetails",
      id: videoId,
      key: config.youtube.key
    }
  });

  if (res.data.items.length === 0) return null;

  return res.data.items[0].liveStreamingDetails.activeLiveChatId;
};

export const fetchLiveChats = async (
  chatId: string,
  pageToken: string,
  maxResults: number
): Promise<any> => {
  const res = await axios.get(
    `https://www.googleapis.com/youtube/v3/liveChat/messages`,
    {
      params: {
        liveChatId: chatId,
        pageToken,
        maxResults,
        part: "id,snippet,authorDetails",
        key: config.youtube.key
      }
    }
  );

  return res.data;
};

export const chatListener = async (
  channel: string,
  prefix: string,
  callback: (
    channel: string,
    messages: Message[],
    firstInterval: boolean
  ) => Promise<void>
): Promise<void> => {
  const broadcast = await getBroadcast(channel);

  if (!broadcast.messages) {
    broadcast.messages = [];
    await updateBroadcast(broadcast);

    let firstInterval = true;

    const handleChatMessages = (result) => {
      if (!broadcast.isLive) return;

      if (!result) return;

      if (result.error) {
        console.log(result.error);
        return;
      }

      let chatEnded = false;
      for (const message of result.items) {
        if (message.snippet.type === "chatEndedEvent") {
          chatEnded = true;
        }
      }

      if (result.offlineAt || chatEnded) {
        stopBroadcast(channel);
        return;
      }

      setTimeout(() => {
        fetchLiveChats(broadcast.chatId, result.nextPageToken, 2000).then(
          handleChatMessages
        );
      }, Math.max(result.pollingIntervalMillis, 5000));

      const messages: Message[] = result.items.map((data) =>
        parseMessage(data, prefix)
      );

      callback(channel, messages, firstInterval);
      if (firstInterval) firstInterval = false;
    };

    fetchLiveChats(broadcast.chatId, undefined, 2000).then(handleChatMessages);
  }
};

export const stopBroadcast = async (channel: string): Promise<void> => {
  const broadcast = await getBroadcast(channel);

  const currentBroadcast = {
    ...broadcast,
    isLive: false,
    chatId: "",
    messages: null
  };

  await updateBroadcast(currentBroadcast);
};

export const parseMessage = (data: any, prefix: string) => {
  if (data.snippet.type !== "textMessageEvent") return;

  return {
    message: data.snippet.displayMessage,
    sender: message.sender(data),
    command: message.command(prefix, data),
    send: new Date(data.snippet.publishedAt)
  };
};

export const removeBroadcastByChatId = async (
  chatId: string
): Promise<void> => {
  const broadcasts = await getBroadcasts();
  let curBroadcast = broadcasts.find((b) => b.chatId === chatId);

  curBroadcast = {
    ...curBroadcast,
    isLive: false,
    chatId: "",
    messages: null
  };

  await updateBroadcast(curBroadcast);
};
