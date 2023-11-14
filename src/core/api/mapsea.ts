import axios, { AxiosInstance } from "axios";
import env from "../config/env";

export default class MapseaApiInstance {
  private API: AxiosInstance;
  private API_URL: string;
  constructor() {
    this.API_URL = env.apiUrl.mapseaApi;
    this.API = axios.create({
      baseURL: this.API_URL,
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  signin = async () => {
    try {
      const url = "sso/v1/user/auth/signin";
      const body = {
        email: "mapsea@mapseacorp.com",
        password: "1234qwer!@#$",
      };

      const { data } = await this.API.post(url, body);
      const { act, rct } = data.data;

      return { act, rct };
    } catch (error: any) {
      console.error(error);
      throw new Error("signin Error");
    }
  };

  getUserInfo = async (act: string) => {
    try {
      const url = "sso/v1/token/validation/act/user";
      const headers = { Authorization: `Bearer ${act}` };

      const { data } = await this.API.get(url, { headers });

      const { provider, terms, user_info } = data.data;

      return { provider, terms, user_info };
    } catch (error) {
      console.error(error);
      throw new Error("getUserInfo Error");
    }
  };

  updatePhone = async (act: string, tokenVersionId: string) => {
    try {
      const url = "sso/v1/user/mypage/modified/phone";
      const body = { token_version_id: tokenVersionId };
      const headers = { Authorization: `Bearer ${act}` };

      const { data } = await this.API.patch(url, body, { headers });

      return data;
    } catch (error) {
      console.log("error : ", error);
      throw error;
    }
  };
}
