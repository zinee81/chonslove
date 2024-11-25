import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useQueryRemover({ query, excuteFunc }) {
  const [searchParam, setSearchParam] = useSearchParams();
  const [queryValue, setQueryValue] = useState(null);

  useEffect(() => {
    if (searchParam.has(query)) {
      const value = searchParam.get(query);
      setQueryValue(value);
      searchParam.delete(query);
      setSearchParam(searchParam);
      if (excuteFunc) {
        excuteFunc();
      }
    }
  }, []);

  return queryValue;
}
