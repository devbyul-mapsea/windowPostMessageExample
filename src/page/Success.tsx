import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface IQuery {
  name: string;
}

function Success() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<IQuery>({
    name: "",
  });

  const [pageLife, setPageLife] = useState(true);

  const setQueryHandler = () => {
    const name = searchParams.get("name") as string;
    setQuery({ name });
  };

  useEffect(() => {
    setQueryHandler();
  });

  useEffect(() => {
    if (pageLife === false) {
      const message = JSON.stringify(query);
      window.opener.postMessage(message, "http://localhost:3000/");
      window.close();
    }
  }, [pageLife]);

  setTimeout(() => {
    setPageLife(false);
  }, 2000);
  return (
    <div>
      <p>Success Page</p>
      <p>Hellow {query.name}</p>
    </div>
  );
}

export default Success;
