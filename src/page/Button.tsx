import { useEffect, useRef, useState } from "react";
import NiceApiInstance from "../core/api/nice";
import { INiceApiTokenResult } from "../core/interface/INiceApi.interface";
import { INiceApiTokenResultKey } from "../core/type/niceApi.type";
import { NICE_API_TYPE_ENUM } from "../core/enum/niceApi.enum";

function Button() {
  const ref = useRef();
  const NiceApi = new NiceApiInstance();
  const [niceToken, setNiceToken] = useState<INiceApiTokenResult>({
    enc_data: "",
    integrity_value: "",
    token_version_id: "",
  });

  // OpenApi Result Data [name, email, hash, phone]
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [hash, setHash] = useState<string>();
  const [phone, setPhone] = useState<string>();

  // window.open Value
  const [popup, setPopup] = useState<Window | null>();

  // window Event Status
  const [eventStatus, setEventStatus] = useState<boolean>(false);

  /**
   * [GET] NiceToken
   */
  const getNiceApiEncryptedDataHandler = async () => {
    try {
      const { enc_data, integrity_value, token_version_id } =
        await NiceApi.getPassEncryptedData(NICE_API_TYPE_ENUM.SIGNUP);
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

      const { type } = data;
      if (type == NICE_API_TYPE_ENUM.SIGNUP) {
        const { name } = data;
        setName(name);
      }
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

  /**
   * Test
   */
  useEffect(() => {
    console.log({ name, email, hash, phone });
  }, [name, email, hash, phone]);
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
        <p>
          name : <input type="text" value={name} disabled />{" "}
        </p>
        <br />
        <p>
          email : <input type="text" value={email} disabled />{" "}
        </p>
        <br />
        <p>
          hash(user_idx) : <input type="text" value={hash} disabled />{" "}
        </p>
        <br />
        <p>
          phone : <input type="text" value={phone} disabled />{" "}
        </p>
      </section>
      <br />
    </article>
  );
}

export default Button;
