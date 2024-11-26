import styles from "./Footer.module.css";
import textImg1 from "/img/footer_text1.png";
import textImg2 from "/img/footer_text2.png";

export default function Footer({ scroll }) {
  return (
    <footer>
      <div className={styles.footer}>
        <div className={styles.footer_text}>
          <img src={textImg1} alt="footer 텍스트 1" />
          <img src={textImg2} alt="footer 텍스트 2" />
        </div>
        <button className={styles.footer_Btn} onClick={scroll}>
          숙소 검색하기
        </button>
      </div>
    </footer>
  );
}
