import { HttpResponse } from "@interfaces/http";
import { get } from "@utils/http";

export const fetchVideo = async (videoId: string): Promise<HttpResponse> =>
  get({ endpoint: `/v1/video/fetch/${videoId}` });
