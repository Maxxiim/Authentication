import type {
  UserFieldRegistration,
  UserFieldLogin,
  UserResponse,
} from "./../shared/types/type";

import { fetchResponse } from "../utils/fetchResponse";

import { url } from "../api/url";

export const authApi = {
  login: async (data: UserFieldLogin) => {
    return await fetchResponse<UserResponse, UserFieldLogin>(
      url,
      "login",
      "POST",
      data,
      {
        credentials: "include",
      },
    );
  },

  registration: async (data: UserFieldRegistration) => {
    return await fetchResponse<UserResponse, UserFieldRegistration>(
      url,
      "registration",
      "POST",
      data,
    );
  },
};
