import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { INiceApiSignUpResultQuery } from "../core/interface/INiceApi.interface";
import { NICE_API_TYPE_ENUM } from "../core/enum/niceApi.enum";

function Success() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<{ [key: string]: string }>({
    req_type: "",
  });

  const [pageLife, setPageLife] = useState(true);

  const setQueryHandler = () => {
    const req_type = searchParams.get("req_type") as string;
    let set_data = {};

    if (Number(req_type) === NICE_API_TYPE_ENUM.SIGNUP) {
      const name = searchParams.get("name") as string;

      set_data = { req_type, name };
    }
    if (Number(req_type) === NICE_API_TYPE_ENUM.FINDID) {
      const user_type = searchParams.get("user_type") as string;
      const email = searchParams.get("email") as string;

      set_data = { req_type, user_type, email };
    }
    if (Number(req_type) === NICE_API_TYPE_ENUM.FINDPWD) {
      const user_type = searchParams.get("user_type") as string;
      const encrypted = searchParams.get("encrypted") as string;
      const key = searchParams.get("key") as string;
      const iv = searchParams.get("iv") as string;

      set_data = { req_type, user_type, encrypted, key, iv };
    }
    if (Number(req_type) === NICE_API_TYPE_ENUM.UPDATEPHONE) {
      const phone = searchParams.get("phone") as string;

      set_data = { req_type, phone };
    }

    setQuery(set_data);
  };

  useEffect(() => {
    setQueryHandler();
  });

  useEffect(() => {
    if (pageLife === false) {
      const message = JSON.stringify(query);
      window.opener.postMessage(message, "http://127.0.0.1:3000/");
      window.close();
    }
  }, [pageLife]);

  setTimeout(() => {
    setPageLife(false);
  }, 500);
  return (
    <div>
      <p>Success Page</p>
      <p>Type : {query.type}</p>
      <p>name : {query.name}</p>
    </div>
  );
}

export default Success;
