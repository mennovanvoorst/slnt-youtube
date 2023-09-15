import { fetchChannels } from "@api/settings";
import { fetchSettings, fetchUsers } from "@api/user";
import { updateUser } from "@services/user";
import { getSettings, updateSettings } from "@services/settings";
import { Socket } from "socket.io-client";
import { joinSession } from "../sockets/services/session";
import {
  addBroadcast,
  chatListener,
  getBroadcast,
  getBroadcastFromChannel,
  getBroadcasts,
  getLiveChatIdFromVideoId,
  updateBroadcast
} from "@services/youtube";
import { Message } from "@interfaces/broadcast";
import { CommandProps } from "@interfaces/commands";
import CommandHandlers from "@commands";
import { updateTimedMessages } from "@services/timedMessages";

let activeStreams = [];

export default async ({ socket }: { socket: Socket }): Promise<void> => {
  const onMessage = async (
    channel: string,
    messages: Message[],
    firstInterval: boolean
  ): Promise<void> => {
    if (messages.length === 0) return;

    const broadcast = await getBroadcast(channel);
    const curBroadcast = { ...broadcast };

    curBroadcast.messages = [...broadcast.messages, ...messages];
    await updateBroadcast(curBroadcast);

    if (firstInterval) return;

    const otherMessages = messages.filter(
      (message) => message.sender.username !== "SLNT_DJ"
    );

    otherMessages.forEach((message) => {
      console.log(message);

      if (message.command.isCommand) {
        const eventHandler: (data: CommandProps) => void =
          CommandHandlers[message.command.trigger];

        const customEventHandler: (data: CommandProps) => void =
          CommandHandlers.custom;

        if (eventHandler && typeof eventHandler === "function")
          eventHandler({ broadcast, socket, message });
        else if (customEventHandler && typeof customEventHandler === "function")
          customEventHandler({
            broadcast,
            socket,
            message
          });
      }
    });
  };

  const pollForStreams = async () => {
    try {
      const broadcasts = await getBroadcasts();

      for (const broadcast in broadcasts) {
        let curBroadcast = broadcasts[broadcast];

        if (curBroadcast.isLive) return;

        if (activeStreams.includes(curBroadcast.channel)) {
          activeStreams = activeStreams.filter(
            (currentStream) => currentStream !== curBroadcast.channel
          );
        }

        const stream = await getBroadcastFromChannel(curBroadcast.channel);
        if (!stream) return;

        /*if (!stream) {
          curBroadcast = {
            ...curBroadcast,
            isLive: false,
            chatId: "",
            messages: null
          };

          await updateBroadcast(curBroadcast);
        }*/

        activeStreams.push(curBroadcast.channel);
        const chatId = await getLiveChatIdFromVideoId(stream);

        if (!chatId) return;

        curBroadcast = { ...curBroadcast, isLive: true, chatId };
        await updateBroadcast(curBroadcast);

        const settings = await getSettings(curBroadcast.channel);
        await chatListener(
          curBroadcast.channel,
          settings.settings.bot_prefix,
          onMessage
        );

        await updateTimedMessages(
          curBroadcast,
          settings.settings.bot_timedmessages
        );

        console.log("listening to", curBroadcast.channel);
      }
    } catch (e) {
      console.log(e.response.data.error);
    }
  };

  const init = async (): Promise<void> => {
    const channels = await fetchChannels();
    const users = await fetchUsers(
      channels.payload.map((channel) => channel.user_id)
    );

    await Promise.all(
      users.payload
        .filter((user) => "youtube" in user.providers)
        .map(async (user) => {
          await updateUser(user);

          const settings = await fetchSettings(user.id);
          await updateSettings(
            socket,
            user.providers.youtube,
            settings.payload
          );
        })
    );

    await pollForStreams();
    setInterval(pollForStreams, 300000); // 5 minutes
  };

  await init();
};
