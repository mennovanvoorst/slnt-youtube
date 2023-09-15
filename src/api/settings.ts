import { HttpResponse } from "@interfaces/http";
import { get } from "@utils/http";

export const fetchChannels = async (): Promise<HttpResponse> =>
  get({
    endpoint: `/v1/settings/filter`,
    params: { key: "bot_enabled", value: true }
  });
