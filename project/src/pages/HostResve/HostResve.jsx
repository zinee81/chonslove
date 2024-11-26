import styles from "./HostResve.module.css";
import logo3 from "/img/logo3.png";
import exit from "/img/exit.png";
import resve from "/img/resve.png";

import { useState, useEffect } from "react";
import { ShowAlert } from "../../utils/AlertUtils.js";
import useQueryRemover from "../../hooks/useQueryRemover.js";
import { useNavigate } from "react-router-dom";
export default function HostResve() {
  const navigate = useNavigate();

  // useQueryRemover에서 반환된 값을 저장
  const reservationId = useQueryRemover({
    query: "id",
    excuteFunc: null,
  });

  const [accommodationId, setAccommodationId] = useState(null);
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState({
    state: "승인대기",
    color: { color: "red" },
    view: true,
  });

  const fetchReservationData = async () => {
    if (!reservationId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `api/reservations/?reservationId=${reservationId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "예약 정보를 불러오는데 실패했습니다.");
      }

      if (data.state === "confirm") {
        setReservation({
          state: "승인완료",
          color: { color: "#394A4B" },
          view: false,
        });
      } else if (data.state === "decline") {
        setReservation({
          state: "승인거절",
          color: { color: "#a6a6a6" },
          view: false,
        });
      } else if (data.state === "delete") {
        setReservation({
          state: "취소된 예약",
          color: { color: "red" },
          view: false,
        });
      }

      setReservationData(data);
      setAccommodationId(data.accommodationId._id);
    } catch (err) {
      setError(err.message || "예약 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect로 reservationId 감시
  useEffect(() => {
    if (reservationId) {
      fetchReservationData();
    }
  }, [reservationId]);

  const confirmAlarm = async () => {
    try {
      const alarmData = {
        reservationId: reservationId,
        url: `chonslove.netlify.app/guest/${reservationId}`,
      };

      const response = await fetch("api/api/alarm/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alarmData),
      });

      if (!response.ok) {
        throw new Error("알람 전송에 실패했습니다.");
      }

      const data = await response.json();
      console.log("알람 전송 성공:", data);
    } catch (error) {
      console.error("알람 전송 실패:", error);
    }
  };

  async function reservationConfirm() {
    if (!reservationId) {
      ShowAlert("fail", "실패", "예약 ID가 존재하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(
        `api/reservations/confirm/${reservationId}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "네트워크 응답이 좋지 않습니다.");
      }

      confirmAlarm();

      setReservation({
        state: "승인완료",
        color: { color: "#394A4B" },
        view: false,
      });
      ShowAlert("success", "성공", data.message);
    } catch (e) {
      ShowAlert("fail", "실패", e.message || "예약 승인 요청에 실패했습니다.");
    }
  }

  const declineAlarm = async () => {
    try {
      const alarmData = {
        reservationId: reservationId,
      };

      const response = await fetch("api/api/alarm/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alarmData),
      });

      if (!response.ok) {
        throw new Error("알람 전송에 실패했습니다.");
      }

      const data = await response.json();
      console.log("알람 전송 성공:", data);
    } catch (error) {
      console.error("알람 전송 실패:", error);
    }
  };

  async function reservationDecline() {
    try {
      const response = await fetch(
        `api/reservations/decline/${reservationId}`,
        {
          method: "PUT", // 필요한 HTTP 메서드 설정
        }
      );

      if (!response.ok) {
        throw new Error("네트워크 응답이 좋지 않습니다.");
      }

      const data = await response.json();

      declineAlarm();

      setReservation({
        state: "승인거절",
        color: { color: "#a6a6a6" },
        view: false,
      });
      ShowAlert("success", "성공", data.message);
    } catch (e) {
      ShowAlert("fail", "실패", "예약 거절 요청에 실패했습니다.");
    }
  }

  const handleGoBack = () => {
    // 이전 페이지로 이동할 때 직접 경로 지정
    if (accommodationId) {
      navigate(`/host/${accommodationId}`);
    }
  };

  return (
    <div className={styles.hostResve}>
      <div className={styles.hostResve_header}>
        <div className={styles.hostResve_logo}>
          <img src={logo3} alt="" />
        </div>
        <div className={styles.exit}>
          <div onClick={handleGoBack} className={styles.exit_btn}>
            <img src={exit} alt="" />
            <p> 예약목록</p>
          </div>
        </div>
      </div>
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {reservationData && (
        <div className={styles.hostResve_main}>
          <div className={styles.userName}>
            <b>{reservationData.accommodationId.name}</b> 님
          </div>
          <div className={styles.hostResve_title}>
            <img src={resve} alt="" />
            <p>예약 관리</p>
          </div>
          <div className={styles.approvalResult}>
            <p style={reservation.color}>{reservation.state}</p>
          </div>
          <div className={styles.hostResve_box}>
            <div className={styles.guest_info}>
              <div>게스트</div>
              {reservation.state == "승인완료" && !reservation.view && (
                <div>전화번호</div>
              )}
              <div>체크인</div>
              <div>체크아웃</div>
              <div>인원수</div>
              <div>전달사항</div>
            </div>
            <div className={styles.guest_infoValue}>
              <div>{reservationData.userId.name}</div>
              {reservation.state == "승인완료" && !reservation.view && (
                <div>
                  {reservationData.userId.phone.replace(
                    /(\d{3})(\d{4})(\d{4})/,
                    "$1-$2-$3"
                  )}
                </div>
              )}
              <div>{reservationData.startDate.split("T")[0]}</div>
              <div>{reservationData.endDate.split("T")[0]}</div>
              <div>{reservationData.person}</div>
              <div>{reservationData.message}</div>
            </div>
          </div>
          <div className={styles.hostResve_btn}>
            {reservationData.state == "await" && reservation.view && (
              <>
                <div onClick={reservationConfirm}>승인</div>
                <div onClick={reservationDecline}>거절</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
