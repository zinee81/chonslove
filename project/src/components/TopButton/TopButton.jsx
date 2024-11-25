import { useState, useEffect } from "react";
import styles from "./TopButton.module.css";

export default function TopButton() {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleShowButton = () => {
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleShowButton);
    return () => {
      window.removeEventListener("scroll", handleShowButton);
    };
  }, []);

  return (
    <div
      className={`${styles.scroll__container} ${
        showButton ? styles.visible : ""
      }`}
    >
      <button className={styles.top} onClick={scrollToTop} type="button">
        <p className={styles.top_text}>TOP</p>
      </button>
    </div>
  );
}
