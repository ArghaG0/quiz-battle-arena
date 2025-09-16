import { stackClientApp } from "./stack";

export const auth = {
  getAuthHeaderValue: async (): Promise<string> => {
    const user = await stackClientApp.getUser();

    if (!user) {
      return "";
    }

    const { accessToken } = await user.getAuthJson();
    return `Bearer ${accessToken}`;
  },
  getAuthToken: async (): Promise<string> => {
    const user = await stackClientApp.getUser();

    if (!user) {
      return "";
    }

    const { accessToken } = await user.getAuthJson();
    return accessToken ?? "";
  }
}
