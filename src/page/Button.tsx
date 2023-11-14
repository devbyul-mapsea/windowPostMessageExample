import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import NiceApiInstance from "../core/api/nice";
import { INiceApiTokenResult } from "../core/interface/INiceApi.interface";
import { INiceApiTokenResultKey } from "../core/type/niceApi.type";
import { NICE_API_TYPE_ENUM } from "../core/enum/niceApi.enum";
import { SSO_USER_TYPE } from "../core/enum/sso.enum";
import MapseaApiInstance from "../core/api/mapsea";

function Button() {
  const NiceApi = new NiceApiInstance();
  const MapseaApi = new MapseaApiInstance();
  const [tokenVersionId, setTokenVersionId] = useState<string>();
  const [niceToken, setNiceToken] = useState<INiceApiTokenResult>({
    enc_data: "",
    integrity_value: "",
    token_version_id: "",
  });

  const [reqType, setreqType] = useState<NICE_API_TYPE_ENUM>(
    NICE_API_TYPE_ENUM.EMPTY
  );
  const [userType, setUserType] = useState<SSO_USER_TYPE>(SSO_USER_TYPE.USER);

  // OpenApi Result Data [name, email, hash, phone]
  const [name, setName] = useState<string>();
  const [findEmail, setFindEmail] = useState<{
    userType: string;
    email: string;
  }>({
    userType: "",
    email: "",
  });
  const [findPwd, setFindPwd] = useState<{
    userType: string;
    encrypted: string;
    key: string;
    iv: string;
  }>({
    userType: "",
    encrypted: "",
    key: "",
    iv: "",
  });
  const [updatePhone, setUpdatePhone] = useState<{
    phone: string;
  }>({
    phone: "",
  });

  // window.open Value
  const [popup, setPopup] = useState<Window | null>();

  /**
   * [GET] NiceToken
   */
  const getNiceApiEncryptedDataHandler = async () => {
    try {
      const getPassEncryptedDataParam = { userType, reqType };

      const { enc_data, integrity_value, token_version_id } =
        await NiceApi.getPassEncryptedData(getPassEncryptedDataParam);
      setNiceToken({ enc_data, integrity_value, token_version_id });
    } catch (error) {
      console.error("getNiceApiEncryptedDataHandler Error : ", error);
    }
  };

  /**
   * Nice API Popup Open & NiceToken Init
   */
  const redirectHandler = () => {
    const form = document.forms.namedItem("nice_form");
    if (form) {
      niceApiPopupOpenHandler(form);
      setNiceToken({ enc_data: "", integrity_value: "", token_version_id: "" });
      setTokenVersionId(niceToken.token_version_id);
    }
  };

  /**
   * Nice API window.open
   */
  const niceApiPopupOpenHandler = (form: HTMLFormElement) => {
    const left = window.innerWidth / 2 - 500 / 2;
    const top = window.innerHeight / 2 - 800 / 2;
    const option = `status=no, menubar=no, toolbar=no, resizable=no, width=500, height=600, left=${left}, top=${top}`;
    const popup = window.open("", "nicePopup", option);
    if (popup) {
      form.action =
        "https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb";
      form.target = "nicePopup";
      form.m.value = "service";
      form.token_version_id.value = niceToken.token_version_id;
      form.enc_data.value = niceToken.enc_data;
      form.integrity_value.value = niceToken.integrity_value;
      form.submit();

      setPopup(popup);
    }
  };

  /**
   * Nice Token Validation
   */
  const isEmptyNiceToken = () => {
    return Object.keys(niceToken).every((key: string) => {
      if (!niceTokenKeyValidation(key)) {
        return false;
      }

      if (niceToken[key] === "") {
        return true;
      }

      return false;
    });
  };
  const niceTokenKeyValidation = (
    key: string
  ): key is INiceApiTokenResultKey => {
    return ["enc_data", "integrity_value", "token_version_id"].includes(key);
  };

  /**
   * Message Event Callback Function - message receive event
   */
  const receiveMessageEvent = (event: MessageEvent) => {
    if (event.origin !== "http://127.0.0.1:3000") {
      console.log(
        "event origin is not http://127.0.0.1:3000!!!!! origin : ",
        event.origin
      );
      return;
    }
    const getMessage = event.data;
    if (typeof getMessage === "string") {
      const data = JSON.parse(getMessage);
      console.log("data : ", data);

      const { req_type } = data;
      if (req_type == NICE_API_TYPE_ENUM.SIGNUP) {
        const { name } = data;
        setName(name);
      }
      if (req_type == NICE_API_TYPE_ENUM.FINDID) {
        const { user_type, email } = data;
        setFindEmail({ userType: user_type, email });
      }
      if (req_type == NICE_API_TYPE_ENUM.FINDPWD) {
        console.log("FINDPWD : ", data);
        const { user_type, encrypted, key, iv } = data;
        setFindPwd({ userType: user_type, encrypted, key, iv });
      }
      if (req_type == NICE_API_TYPE_ENUM.UPDATEPHONE) {
        console.log("UPDATEPHONE : ", data);
        const { phone } = data;
        setUpdatePhone({ phone });
      }
    }
  };

  /**
   * Request Nice Type [ Sign Up / Find Id / Find Pwd / Update Phone Number ]
   */
  const setreqTypeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setreqType(value);
  };

  /**
   * Request User Type [ User / Company ]
   */
  const setUserTypeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setUserType(value);
  };

  /**
   * API Test 용 핸들러
   */
  const apiTestHandler = async () => {
    try {
      const { act } = await MapseaApi.signin();
      const { provider, terms, user_info } = await MapseaApi.getUserInfo(act);

      console.log("signin : ", { act });
      console.log("getUserInfo : ", { provider, terms, user_info });
    } catch (error) {
      throw error;
    }
  };

  /**
   * 휴대폰 연락처 본인인증
   */
  const checkCiValidationHanlder = async (e: MouseEvent<HTMLInputElement>) => {
    try {
      if (tokenVersionId) {
        const { act } = await MapseaApi.signin();
        await MapseaApi.updatePhone(act, tokenVersionId);
      } else {
        throw new Error("휴대폰 인증을 진행해주세요");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  /**
   * Message Event Init
   */
  useEffect(() => {
    window.addEventListener("message", receiveMessageEvent, false);
    return () => {
      window.removeEventListener("message", receiveMessageEvent, false);
    };
  }, []);

  /**
   * Get Nice Token Init
   */
  useEffect(() => {
    if (isEmptyNiceToken()) {
      getNiceApiEncryptedDataHandler();
    }
  }, [niceToken]);

  /**
   * Get Nice Token Init
   */
  useEffect(() => {
    if (reqType !== NICE_API_TYPE_ENUM.EMPTY) {
      getNiceApiEncryptedDataHandler();
    }
  }, [reqType]);

  /**
   * Get Nice Token Reset
   */
  useEffect(() => {
    const popupCloseEvent = setInterval(() => {
      if (popup?.closed) {
        getNiceApiEncryptedDataHandler();
        setPopup(null);
        clearInterval(popupCloseEvent);
      }
    }, 1000);

    return () => clearInterval(popupCloseEvent);
  }, [popup, niceToken]);

  /**
   * Test
   */
  useEffect(() => {
    console.log({ name, findEmail, findPwd, updatePhone });
  }, [name, findEmail, findPwd, updatePhone]);
  return (
    <article>
      <input
        type="button"
        onClick={apiTestHandler}
        value="API 테스트 유효성 검사"
      />
      <div style={{ display: "flex", gap: "20px" }}>
        <section>
          <p>Nice Token Type</p>
          <select onChange={setreqTypeHandler}>
            <option value={NICE_API_TYPE_ENUM.EMPTY} defaultChecked>
              EMPTY
            </option>
            <option value={NICE_API_TYPE_ENUM.SIGNUP}>SIGNUP</option>
            <option value={NICE_API_TYPE_ENUM.FINDID}>FINDID</option>
            <option value={NICE_API_TYPE_ENUM.FINDPWD}>FINDPWD</option>
            <option value={NICE_API_TYPE_ENUM.UPDATEPHONE}>UPDATEPHONE</option>
          </select>
        </section>
        <section>
          <p>User Type</p>
          <select onChange={setUserTypeHandler}>
            <option value={SSO_USER_TYPE.USER} defaultChecked>
              USER
            </option>
            <option value={SSO_USER_TYPE.COMPANY}>COMPANY</option>
          </select>
        </section>
      </div>

      <section>
        <form name="nice_form" id="form">
          <input type="hidden" id="m" name="m" />
          <input type="hidden" id="token_version_id" name="token_version_id" />
          <input type="hidden" id="enc_data" name="enc_data" />
          <input type="hidden" id="integrity_value" name="integrity_value" />
        </form>
        <button
          onClick={redirectHandler}
          disabled={reqType === NICE_API_TYPE_ENUM.EMPTY}
        >
          휴대폰 번호로 본인인증 하기
        </button>
      </section>
      <section>
        <p>
          token_version_id :{" "}
          <input type="text" value={niceToken.token_version_id} />
          token_version_id : <input type="text" value={tokenVersionId} />
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            gap: "10px",
          }}
        >
          <h1>SIGNUP</h1>
          name : <input type="text" value={name} disabled />{" "}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            gap: "10px",
          }}
        >
          <h1>FINDID</h1>
          user_type : <input
            type="text"
            value={findEmail.userType}
            disabled
          />{" "}
          email : <input type="text" value={findEmail.email} disabled />{" "}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            gap: "10px",
          }}
        >
          <h1>FINDPWD</h1>
          user_type : <input
            type="text"
            value={findPwd.userType}
            disabled
          />{" "}
          hash : encrypted :{" "}
          <input type="text" value={findPwd.encrypted} disabled /> hash : key :{" "}
          <input type="text" value={findPwd.key} disabled /> hash : iv :{" "}
          <input type="text" value={findPwd.iv} disabled /> hash : hmac :{" "}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            gap: "10px",
          }}
        >
          <h1>UPDATEPHONE</h1>
          <span>phone : </span>
          <input type="tel" value={updatePhone.phone} disabled />
          <input
            type="button"
            onClick={checkCiValidationHanlder}
            value="CI 유효성 검사"
          />
        </div>
      </section>
    </article>
  );
}

export default Button;
