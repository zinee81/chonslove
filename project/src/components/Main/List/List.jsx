import styles from "./List.module.css";
import { useState, useEffect } from "react";
import SwiperChonList from "./SwiperChonList/SwiperChonList";

export default function List() {
  const [recentAccommodations, setRecentAccommodations] = useState([]);
  const [topGradeAccommodations, setTopGradeAccommodations] = useState([]);

  useEffect(() => {
    fetch(
      "https://port-0-chon-m3qz4omzb344e0d7.sel4.cloudtype.app/accommodations/top_date"
    )
      .then((res) => res.json())
      .then((data) => setRecentAccommodations(data));

    // 평점 높은 숙소 API 호출
    fetch(
      "https://port-0-chon-m3qz4omzb344e0d7.sel4.cloudtype.app/accommodations/top_grade"
    )
      .then((res) => res.json())
      .then((data) => setTopGradeAccommodations(data));

    // 최신 숙소 API 호출
  }, []);

  return (
    <>
      <div className="w1200">
        <div className={styles.chon_list}>
          <div className={styles.card_title}>
            <p>새로 입점했어요</p>
            <p>촌스럽게 신규 입점한 숙소를 만나보세요.</p>
          </div>
          <div className={styles.card_conteiner}>
            <SwiperChonList accommodations={recentAccommodations} />
          </div>
        </div>
        <div className={styles.chon_list}>
          <div className={styles.card_title}>
            <p>추천 촌캉스</p>
            <p>이벤트 진행중인 숙소를 만나보세요.</p>
          </div>
          <div className={styles.card_conteiner}>
            <SwiperChonList accommodations={topGradeAccommodations} />
          </div>
        </div>
      </div>
    </>
  );
}
