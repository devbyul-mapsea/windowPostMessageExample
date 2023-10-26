import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { INiceApiSignUpResultQuery } from "../core/interface/INiceApi.interface";

function Success() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<INiceApiSignUpResultQuery>({
    type: "",
    name: "",
  });

  const [pageLife, setPageLife] = useState(true);

  const setQueryHandler = () => {
    const type = searchParams.get("type") as string;
    const name = searchParams.get("name") as string;
    setQuery({ type, name });
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
