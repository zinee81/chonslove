import styles from "./Login.module.css";

const ResisterTag = () => {
  return (
    <div className={styles.resisterTag}>
      <p>
        촌스럽게가 처음이세요?{" "}
        <a href="/register" className={styles.resiterTagBtn}>
          회원가입
        </a>
      </p>
    </div>
  );
};

export default ResisterTag;
