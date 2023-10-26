export interface INiceApiTokenResult {
  [key: string]: string;
  enc_data: string;
  integrity_value: string;
  token_version_id: string;
}

export interface IGetPassEncryptedDataBody {
  success: string;
  fail: string;
  type: number;
}

export interface INiceApiSignUpResultQuery {
  type: string;
  name: string;
}
