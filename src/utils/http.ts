import axios, { AxiosError } from "axios";
import { HttpResponse, HttpRequest } from "@interfaces/http";
import config from "@config";

export const getRaw = async ({
  endpoint,
  params,
  token
}: HttpRequest): Promise<HttpResponse> =>
  axios
    .get(`${endpoint}`, {
      params: { ...params },
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => ({ success: true, payload: res.data }))
    .catch((e: AxiosError) => {
      console.log(e);
      return { success: false, payload: e.message };
    });

export const get = async ({
  endpoint,
  params
}: HttpRequest): Promise<HttpResponse> =>
  axios
    .get(`${config.server_url}${config.api.prefix}${endpoint}`, {
      params: { ...params },
      withCredentials: true
    })
    .then((res) => ({ success: true, payload: res.data }))
    .catch((e: AxiosError) => {
      console.log(e);
      return { success: false, payload: e.message };
    });
