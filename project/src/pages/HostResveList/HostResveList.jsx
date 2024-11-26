import styles from "./HostResveList.module.css";
import logo3 from "/img/logo3.png";
import resve from "/img/resve.png";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReservationItem from "./ReservationItem/ReservationItem";

export default function HostResveList() {
  const { id } = useParams();
  const [reservationData, setReservationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accommodationName, setAccommodationName] = useState("");

  const fetchReservation = async () => {
    try {
      const acc_response = await fetch(
        `api/accommodations/detail?accommodationId=${id}`
      );
      const acc_data = await acc_response.json();
      setAccommodationName(acc_data.name);

      const response = await fetch(
        `api/accommodations/reservations?accommodationId=${id}`
      );

      const data = await response.json();
      const reservationDatas = data.reservationData;

      setReservationData(reservationDatas); // 예약 정보 저장
    } catch (err) {
      setError("예약 정보를 불러오는 데 실패했습니다."); // 오류 처리
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 실행이 완료된 후 useEffect 실행
  useEffect(() => {
    fetchReservation();
  }, []);

  return (
    <div className={styles.hostResve}>
      <div className={styles.hostResve_header}>
        <div className={styles.hostResve_logo}>
          <img src={logo3} alt="" />
        </div>
      </div>
      <div className={styles.hostResve_main}>
        <div className={styles.userName}>
          <b>{accommodationName}</b> 님
        </div>
        <div className={styles.hostResve_title}>
          <img src={resve} alt="" />
          <p>예약 관리</p>
        </div>
        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {reservationData &&
          reservationData.map((res, index) => {
            return <ReservationItem reservation={res} key={index} />;
          })}
      </div>
    </div>
  );
}
