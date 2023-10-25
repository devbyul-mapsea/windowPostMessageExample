import { useEffect, useState } from "react";
import axios from "axios";
type INiceApiTokenResultKey =
  | "enc_data"
  | "integrity_value"
  | "token_version_id";
interface INiceApiTokenResult {
  [key: string]: string;
  enc_data: string;
  integrity_value: string;
  token_version_id: string;
}

const local_redirectUrl = "http://127.0.0.1:3000/success";
const local_apiUrl = "http://127.0.0.1:4100/api/nice/pass/encrypted";

const redirectUrl = local_redirectUrl;
const apiUrl = local_apiUrl;

function Button() {
  const [niceToken, setNiceToken] = useState<INiceApiTokenResult>({
    enc_data: "",
    integrity_value: "",
    token_version_id: "",
  });
  const [name, setName] = useState<string>();
  const [popup, setPopup] = useState<Window | null>();

  /**
   * [GET] NiceToken
   */
  const getNiceApiEncryptedDataHandler = async () => {
    const url = new URL(apiUrl);
    url.searchParams.append("redirect", redirectUrl);

    try {
      const { data } = await axios.get(url.href);
      const { enc_data, integrity_value, token_version_id } = data;
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
   * Message Event
   */
  const addEventHandler = () => {
    window.addEventListener("message", receiveMessageEvent, false);
  };
  /**
   * Message Event Callback Function - message receive event
   */
  const receiveMessageEvent = (event: MessageEvent) => {
    if (event.origin !== "http://localhost:3000") {
      console.log("evnt origin is not localhost:3000!!!!!");
      return;
    }
    const getMessage = event.data;
    console.log("getMessage : ", getMessage);
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
   * Message Event Init
   */
  useEffect(() => {
    addEventHandler();
  }, []);

  /**
   * Get Nice Token Init
   */
  useEffect(() => {
    if (isEmptyNiceToken()) {
      getNiceApiEncryptedDataHandler();
    }
  }, []);

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
  return (
    <article>
      <section>
        <form name="nice_form" id="form">
          <input type="hidden" id="m" name="m" />
          <input type="hidden" id="token_version_id" name="token_version_id" />
          <input type="hidden" id="enc_data" name="enc_data" />
          <input type="hidden" id="integrity_value" name="integrity_value" />
        </form>
        <button onClick={redirectHandler}>휴대폰 번호로 본인인증 하기</button>
      </section>
      <section>
        <br />
        <input type="text" value={name} disabled />
      </section>
      <br />
    </article>
  );
}

export default Button;
