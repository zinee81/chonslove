import styles from "./List.module.css";
import { useState, useEffect } from "react";
import SwiperChonList from "./SwiperChonList/SwiperChonList";

export default function List() {
  const [recentAccommodations, setRecentAccommodations] = useState(null);
  const [topGradeAccommodations, setTopGradeAccommodations] = useState(null);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [isLoadingTop, setIsLoadingTop] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    setIsInitialLoad(true);
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [recentAccommodations, topGradeAccommodations]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingRecent(true);
        setIsLoadingTop(true);
        setRecentAccommodations(null);
        setTopGradeAccommodations(null);

        const recentResponse = await fetch("api/accommodations/top_date");
        if (!recentResponse.ok) {
          throw new Error("Recent accommodations fetch failed");
        }
        const recentData = await recentResponse.json();
        setRecentAccommodations(recentData);
        setIsLoadingRecent(false);

        const topResponse = await fetch("api/accommodations/top_grade");
        if (!topResponse.ok) {
          throw new Error("Top grade accommodations fetch failed");
        }
        const topData = await topResponse.json();
        setTopGradeAccommodations(topData);
        setIsLoadingTop(false);
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
        setIsLoadingRecent(false);
        setIsLoadingTop(false);
      }
    };

    fetchData();

    return () => {
      setIsLoadingRecent(true);
      setIsLoadingTop(true);
      setRecentAccommodations(null);
      setTopGradeAccommodations(null);
    };
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
            <SwiperChonList
              accommodations={recentAccommodations}
              isLoading={
                isInitialLoad || isLoadingRecent || !recentAccommodations
              }
            />
          </div>
        </div>
        <div className={styles.chon_list}>
          <div className={styles.card_title}>
            <p>추천 촌캉스</p>
            <p>이벤트 진행중인 숙소를 만나보세요.</p>
          </div>
          <div className={styles.card_conteiner}>
            <SwiperChonList
              accommodations={topGradeAccommodations}
              isLoading={
                isInitialLoad || isLoadingTop || !topGradeAccommodations
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
