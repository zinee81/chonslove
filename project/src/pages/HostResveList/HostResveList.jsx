import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import ReservationItem from "./ReservationItem/ReservationItem";
import { accommodationAPI } from "../../api/accommodationAPI";
import { ShowAlert } from "../../utils/AlertUtils";

import styles from "./HostResveList.module.css";
import logo3 from "/img/logo3.png";
import resve from "/img/resve.png";

export default function HostResveList() {
  const { id } = useParams();
  const [reservationData, setReservationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accommodationName, setAccommodationName] = useState("");

  const fetchReservation = async () => {
    try {
      const accData = await accommodationAPI.getAccommodationDetail(id);
      setAccommodationName(accData.name);

      const reservationsResponse =
        await accommodationAPI.getAccommodationReservations(id);
      setReservationData(reservationsResponse.reservationData);
    } catch (error) {
      console.error("예약 정보 조회 실패:", error);
      setError("예약 정보를 불러오는 데 실패했습니다.");
      ShowAlert("error", "", "예약 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservation();
  }, [id]); // id가 변경될 때마다 다시 조회

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
          reservationData.map((res, index) => (
            <ReservationItem reservation={res} key={res._id || index} />
          ))}
      </div>
    </div>
  );
}
