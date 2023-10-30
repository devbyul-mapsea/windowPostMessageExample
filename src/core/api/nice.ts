import axios, { AxiosInstance } from "axios";
import {
  IGetPassEncryptedDataBody,
  INiceApiTokenResult,
} from "../interface/INiceApi.interface";
import { IQueryString } from "../interface/IAxios.interface";
import { NICE_API_TYPE_ENUM } from "../enum/niceApi.enum";
import env from "../config/env";
import { SSO_USER_TYPE } from "../enum/sso.enum";

export default class NiceApiInstance {
  private API: AxiosInstance;
  private API_URL: string;
  constructor() {
    this.API_URL = env.apiUrl.openApi;
    this.API = axios.create({ baseURL: this.API_URL });
  }

  private setApiUrl = ({
    apiPath,
    pathParameter,
    queryStrings,
  }: {
    apiPath: string;
    pathParameter?: string;
    queryStrings?: IQueryString;
  }) => {
    const baseURL = this.API.defaults.baseURL as string;
    const apiUrl = new URL(baseURL);
    apiUrl.pathname = apiPath;
    if (queryStrings) {
      for (const [key, value] of Object.entries(queryStrings)) {
        apiUrl.searchParams.append(key, value);
      }
    }

    return apiUrl.toString();
  };

  private getRedirectUrl = ({
    userType,
    reqType,
  }: {
    userType: SSO_USER_TYPE;
    reqType: NICE_API_TYPE_ENUM;
  }): IGetPassEncryptedDataBody => {
    let body;
    try {
      switch (reqType) {
        case NICE_API_TYPE_ENUM.SIGNUP:
          body = env.redirectUrl.signUp;
          break;
        case NICE_API_TYPE_ENUM.FINDID:
          body = env.redirectUrl.findId;
          break;
        case NICE_API_TYPE_ENUM.FINDPWD:
          body = env.redirectUrl.findPwd;
          break;
        case NICE_API_TYPE_ENUM.UPDATEPHONE:
          body = env.redirectUrl.updatePhone;
          break;
        default:
          throw new Error("알맞은 type이 반환되지 않았습니다.");
      }

      return { ...body, user_type: userType };
    } catch (error) {
      throw error;
    }
  };

  public getPassEncryptedData = async ({
    userType,
    reqType,
  }: {
    userType: SSO_USER_TYPE;
    reqType: NICE_API_TYPE_ENUM;
  }): Promise<INiceApiTokenResult> => {
    try {
      const url = this.setApiUrl({
        apiPath: env.openApi.getPassEncryptedData.url,
      });

      const body: IGetPassEncryptedDataBody = this.getRedirectUrl({
        userType,
        reqType,
      });
      const { data } = await this.API.post(url, body);

      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Fail : Nice API Encrypte Data");
    }
  };
}
