import styles from "./Header.module.css";
import logo1 from "/img/logo1.png";
import logo2 from "/img/logo2.png";

import { useEffect } from "react";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShowAlert } from "../../utils/AlertUtils.js";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    ShowAlert("info", "", "로그아웃 되었습니다.");
    window.location.reload();
    navigate("/"); // 로그아웃 후 메인 페이지로 이동
  };

  useEffect(() => {
    // 두 번째 로고 (logo2) 애니메이션: 아래에서 위로 먼저 떨어짐
    gsap.fromTo(
      `.${styles.logo2}`,
      { y: -200, opacity: 0 }, // 초기 위치와 투명도
      { y: 0, opacity: 1, duration: 0.7, ease: "bounce.out" }
    );

    // 첫 번째 로고 (logo1) 애니메이션: 두 번째 로고가 떨어지고 나서 시작
    gsap.fromTo(
      `.${styles.logo1}`,
      { y: -200, opacity: 0 }, // 초기 위치와 투명도
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay: 0.4,
        ease: "bounce.out",
      } // 두 번째 로고 애니메이션이 끝난 후 시작
    );

    // 헤드라인에 애니메이션 추가: 서서히 나타나며 왼쪽에서 오른쪽으로 슬라이딩
    gsap.fromTo(
      `.${styles.main_headLine}`,
      {
        opacity: 0,
        x: -100, // 왼쪽에서 시작
      },
      {
        opacity: 1,
        x: 0, // 원위치로 이동
        duration: 1.5,
        delay: 1.2,
        ease: "power3.out", // 부드러운 움직임
      }
    );

    // 서브 헤드라인에 애니메이션 추가: 서서히 나타나며 위에서 아래로 슬라이딩
    gsap.fromTo(
      `.${styles.sub_headLine}`,
      {
        opacity: 0,
        x: -100, // 왼쪽에서 시작
      },
      {
        opacity: 1,
        x: 0, // 원위치로 이동
        duration: 1.5,
        delay: 1.6, // 메인 헤드라인이 끝난 후에 조금 지연
        ease: "power3.out", // 부드러운 움직임
      }
    );
  }, []);

  return (
    <header>
      <div className="w1200">
        <nav>
          <ul>
            {user ? (
              // 로그인 상태
              <li>
                <button onClick={handleLogout} className={styles.logout}>
                  로그아웃
                </button>
              </li>
            ) : (
              // 비로그인 상태
              <>
                <li>
                  <a href="/register">회원가입</a>
                </li>
                <li>
                  <a href="/login">로그인</a>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className={styles.logo_conteiner}>
          <div className={styles.logo_wrap}>
            <div className={`${styles.logo} ${styles.logo1}`}>
              <img src={logo1} alt="" />
            </div>
            <div className={`${styles.logo} ${styles.logo2}`}>
              <img src={logo2} alt="" />
            </div>
          </div>
        </div>

        <div className={styles.headLine_wrap}>
          <div className={styles.main_headLine}>
            <p>자연 속 힐링 여행</p>
            <p>
              <span className={styles.main_headLine_color}>촌캉스</span> 숙소 예약하기
            </p>
          </div>
          <div className={styles.sub_headLine}>
            <p>
              지금바로, <b>촌스럽게</b>에서 만나보세요.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
