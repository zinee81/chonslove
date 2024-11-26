import { forwardRef } from "react";

import Faq from "./Faq/Faq";
import List from "./List/List";
import Search from "./Search/Search";

const Main = forwardRef((props, ref) => {
  return (
    <>
      <Search ref={ref} />
      <List />
      <Faq />
    </>
  );
});

export default Main;
