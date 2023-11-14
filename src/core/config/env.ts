const serverUrl = "http://127.0.0.1:3000/";
const localApiUrl = {
  openApi: "http://127.0.0.1:4100/",
  mapseaApi: "http://127.0.0.1:4000/",
};
const devApiUrl = {
  openApi: "http://dev.api.open-api.dev-sea.com/",
  mapseaApi: "http://dev.api.navigation.dev-sea.com/",
};
const apiUrl = localApiUrl;
const env = {
  apiUrl,
  openApi: {
    getPassEncryptedData: { method: "post", url: "api/nice/pass/encrypted" },
  },
  redirectUrl: {
    signUp: {
      success: `${serverUrl}success`,
      fail: `${serverUrl}fail`,
      req_type: 1,
    },
    findId: {
      success: `${serverUrl}success`,
      fail: `${serverUrl}fail`,
      req_type: 2,
    },
    findPwd: {
      success: `${serverUrl}success`,
      fail: `${serverUrl}fail`,
      req_type: 3,
    },
    updatePhone: {
      success: `${serverUrl}success`,
      fail: `${serverUrl}fail`,
      req_type: 4,
    },
  },
};

export default env;
