import { useEffect, useState } from "react";
import axios from "axios";

interface INiceApiTokenResult {
  enc_data: string;
  integrity_value: string;
  token_version_id: string;
}

function Button() {
  const [niceToken, setNiceToken] = useState<INiceApiTokenResult>({
    enc_data: "",
    integrity_value: "",
    token_version_id: "",
  });

  // const getNiceApiEncryptedDataHandler = async () => {
  //   const url = "http://127.0.0.1:4100/api/nice/pass/encrypted";

  //   try {
  //     const { data } = await axios.get(url);
  //     const { enc_data, integrity_value, token_version_id } = data;

  //     setNiceToken({ enc_data, integrity_value, token_version_id });
  //   } catch (error) {
  //     console.error("getNiceApiEncryptedDataHandler Error : ", error);
  //     alert("error");
  //   }
  // };

  const redirectHandler = () => {
    window.open(
      "http://localhost:3000/redirect",
      "window_name",
      "width=430, height=500, location=0, status=no, scrollbars=yes"
    );
  };

  const addEventHandler = () => {
    window.addEventListener("message", receiveMessageEvent, false);
  };

  const receiveMessageEvent = (event: MessageEvent) => {
    if (event.origin !== "http://localhost:3000") {
      console.log("evnt origin is not localhost:3000!!!!!");
      return;
    }
    const getMessage = event.data;
    console.log("getMessage : ", getMessage);
  };

  useEffect(() => {
    addEventHandler();
  }, []);

  // useEffect(() => {
  //   getNiceApiEncryptedDataHandler();
  // }, []);

  return (
    <form name="form" id="form">
      <input type="hidden" id="m" name="m" value="service" />
      <input
        type="hidden"
        id="token_version_id"
        name="token_version_id"
        value={niceToken.token_version_id}
      />
      <input
        type="hidden"
        id="enc_data"
        name="enc_data"
        value={niceToken.enc_data}
      />
      <input
        type="hidden"
        id="integrity_value"
        name="integrity_value"
        value={niceToken.integrity_value}
      />
      <button onClick={redirectHandler}>휴대폰 번호로 본인인증 하기</button>
    </form>
  );
}

export default Button;
