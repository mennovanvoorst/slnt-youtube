import { HttpResponse } from "@interfaces/http";
import { get } from "@utils/http";

export const fetchUsers = async (users: number[]): Promise<HttpResponse> =>
  get({
    endpoint: `/v1/user/all`,
    params: { users }
  });

export const fetchSettings = async (userId: number): Promise<HttpResponse> =>
  get({
    endpoint: `/v1/user/${userId}/settings`,
    params: { userId }
  });
