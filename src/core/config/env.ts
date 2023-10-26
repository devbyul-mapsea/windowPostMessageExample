const serverUrl = "http://127.0.0.1:3000/";
const localApiUrl = {
  openApi: "http://127.0.0.1:4100/",
};

const openApiUrl = localApiUrl.openApi;

const env = {
  apiUrl: {
    openApi: openApiUrl,
  },
  openApi: {
    getPassEncryptedData: { method: "post", url: "api/nice/pass/encrypted" },
  },
  redirectUrl: {
    signUp: {
      success: `${serverUrl}sign-up/success`,
      fail: `${serverUrl}fail`,
      type: 1,
    },
    findId: {
      success: `${serverUrl}find-id/success`,
      fail: `${serverUrl}fail`,
      type: 2,
    },
    findPwd: {
      success: `${serverUrl}find-pwd/success`,
      fail: `${serverUrl}fail`,
      type: 3,
    },
    updatePhone: {
      success: `${serverUrl}update-phone/success`,
      fail: `${serverUrl}fail`,
      type: 4,
    },
  },
};

export default env;
