import React from "react";
import logo from "/img/logo4.png";
import styles from "./Login.module.css";

const FormHeader = () => {
  return (
    <div className={styles.form_header}>
      <a href="/">
        <img className={styles.logo} src={logo} alt="Logo" />
      </a>
      <h1 className={styles.resister}>로그인</h1>
      <p className={styles.subtitle}>특별한 촌캉스를 경험해보세요</p>
    </div>
  );
};

export default FormHeader;
