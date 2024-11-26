import { useRef } from "react";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import TopButton from "./components/TopButton/TopButton";

import "./index.css";

export default function App() {
  const searchRef = useRef(null);

  const handleScroll = () => {
    searchRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Header />
      <Main ref={searchRef} />
      <Footer scroll={handleScroll} />
      <TopButton />
    </>
  );
}
