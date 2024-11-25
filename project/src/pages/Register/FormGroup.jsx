import React from "react";
import styles from "./Register.module.css";

const FormGroup = ({
  label,
  type,
  placeholder,
  value = "",
  onChange,
  name,
}) => {
  return (
    <div className={styles.form_group}>
      <label className={styles.NameFont}>{label}</label>
      <input
        className={styles.textBoxText}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  );
};

export default FormGroup;
