import React from "react";
import RegisterFormHeader from "./RegisterFormHeader";
import RegisterForm from "./RegisterForm";
import styles from "./Register.module.css";
function Register() {
  return (
    <div className={styles.form_container}>
      <RegisterFormHeader />
      <RegisterForm />
    </div>
  );
}

export default Register;
