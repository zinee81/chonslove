import FormGroup from "./FormGroup";
import ResisterTag from "./ResisterTag";
import styles from "./Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShowAlert } from "../../utils/AlertUtils.js";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("🔑 Login attempt...", formData);

    try {
      if (!formData.id) {
        ShowAlert("info", "", "아이디를 입력해주세요.");
        return;
      }

      if (!formData.password) {
        ShowAlert("info", "", "비밀번호를 입력해주세요.");
        return;
      }

      const response = await fetch("api/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("📡 Server response:", data);

      if (response.ok) {
        if (data.id) {
          login(data);
          navigate("/");
        } else {
          setError(data.message);
        }
      } else {
        console.error("❌ Login error:", data.message);
        setError(data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("💥 API call error:", error);
      setError("서버 연결에 실패했습니다.");
    }
  };

  return (
    <form className={styles.resisterForm} onSubmit={handleSubmit}>
      <FormGroup
        label="아이디"
        type="text"
        placeholder="아이디를 입력해주세요"
        value={formData.id}
        onChange={handleChange}
        name="id"
      />
      <FormGroup
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={formData.password}
        onChange={handleChange}
        name="password"
      />
      {error && <div className={styles.error}>{error}</div>}
      <ResisterTag />
      <button type="submit" className={styles.loginForm_Btn}>
        로그인
      </button>
    </form>
  );
};

export default LoginForm;
