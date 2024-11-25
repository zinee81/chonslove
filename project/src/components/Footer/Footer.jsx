import styles from "./Footer.module.css";
import textImg1 from "/img/footer_text1.png";
import textImg2 from "/img/footer_text2.png";

export default function Footer() {
  const handleSearchClick = () => {
    const searchElement = document.getElementById("search");
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer>
      <div className={styles.footer}>
        <div className={styles.footer_text}>
          <img src={textImg1} alt="" />
          <img src={textImg2} alt="" />
        </div>
        <button className={styles.footer_Btn} onClick={handleSearchClick}>
          숙소 검색하기
        </button>
      </div>
    </footer>
  );
}
