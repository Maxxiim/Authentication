import type {
  UserFieldRegistration,
  UserFieldLogin,
} from "./../shared/types/type";
import { url } from "../api/url";

export const authApi = {
  login: async (data: UserFieldLogin) => {
    const response = await fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      return responseData;
    }

    return responseData;
  },
  registration: async (data: UserFieldRegistration) => {
    const response = await fetch(`${url}/registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return responseData;
    }

    return responseData;
  },
};
