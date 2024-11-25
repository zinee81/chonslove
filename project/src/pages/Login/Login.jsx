import React from "react";
import FormHeader from "./FormHeader";
import styles from "./Login.module.css";
import LoginForm from "./LoginForm";

function Login() {
  return (
    <div className={styles.form_container}>
      <FormHeader />
      <LoginForm />
    </div>
  );
}

export default Login;
