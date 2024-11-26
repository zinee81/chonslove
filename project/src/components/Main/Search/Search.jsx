import { useState, forwardRef } from "react";
import SearchCalendar from "../../SearchCalender/SearchCalender";
import styles from "./Search.module.css";
import searchIcon from "/img/searchIcon.png";
import { searchAccommodations } from "../../../api/accommodationSearch";
import AccomSearch from "./AccomSearch/AccomSearch";
import { ShowAlert } from "../../../utils/AlertUtils.js";

// 지역 데이터
const REGIONS = [
  "전체",
  "강원",
  "경기",
  "경남",
  "경북",
  "대구",
  "전남",
  "전북",
  "충남",
  "충북",
  "제주",
  "서울",
  "대전",
  "부산",
  "울산",
];

export default forwardRef(function Search(props, searchRef) {
  // 상태 관리
  const [activeField, setActiveField] = useState(null); // 현재 활성화된 필드
  const [selectedRegion, setSelectedRegion] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [guests, setGuests] = useState(0);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 검색 처리
  const handleSearch = async () => {
    setActiveField(null);
    setIsLoading(true); // 검색 시작 시 로딩 시작

    try {
      setError("");

      // 날짜 형식 변환 (YYYY-MM-DD) - 한국 시간 기준
      const formatDate = (date) => {
        if (!date) return null;
        // 한국 시간으로 변환 (UTC+9)
        const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
        return kstDate.toISOString().split("T")[0];
      };

      // 검색 파라미터 구성
      const searchParams = {
        region: selectedRegion === "전체" ? "" : selectedRegion,
        checkIn: formatDate(dateRange[0]),
        checkOut: formatDate(dateRange[1]),
        person: guests,
      };

      console.log("검색 파라미터:", searchParams); // 디버깅용

      // API 호출
      const results = await searchAccommodations(searchParams);
      setSearchResults(results); // 검색 결과 저장
      console.log("검색 결과:", results);

      // 여기서 검색 결과를 처리 (예: 상태 업데이트 또는 페이지 이동)
    } catch (error) {
      console.error("검색 오류:", error);
      setError(error.message || "검색 중 오류가 발생했습니다.");
      ShowAlert("info", "", error.message || "검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // 검색 완료 (성공/실패 모두) 후 로딩 종료
    }
  };

  // 달력 클릭 이벤트 전파 방지
  const handleCalendarClick = (e) => {
    e.stopPropagation();
  };

  const handleDateChange = (value) => {
    setDateRange(value);
  };

  return (
    <div className={styles.search} ref={searchRef}>
      <div className="w1200">
        <div className={styles.search_conteiner}>
          <div className={styles.search_title}>촌캉스 숙소 검색하기</div>

          <div className={styles.search_warp}>
            {/* 지역 선택 */}
            <div
              className={styles.search_category_warp}
              onClick={() =>
                setActiveField(activeField === "region" ? null : "region")
              }
            >
              <div className={styles.search_category}>지역</div>
              <div className={styles.search_value}>
                {selectedRegion || "지역 검색"}
              </div>

              {/* 지역 선택 드롭다운 */}
              {activeField === "region" && (
                <div className={styles.dropdown}>
                  {REGIONS.map((region) => (
                    <div
                      key={region}
                      onClick={() => {
                        setSelectedRegion(region);
                        setActiveField(null);
                      }}
                      className={`${styles.region} ${
                        selectedRegion === region ? styles.selected : ""
                      }`}
                    >
                      {region}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 체크인 */}
            <div
              className={styles.search_category_warp}
              onClick={() =>
                setActiveField(activeField === "calendar" ? null : "calendar")
              }
            >
              <div className={styles.search_category}>체크인</div>
              <div className={styles.search_value}>
                {dateRange[0] ? dateRange[0].toLocaleDateString() : "날짜 추가"}
              </div>
            </div>

            {/* 체크아웃 */}
            <div
              className={styles.search_category_warp}
              onClick={() =>
                setActiveField(activeField === "calendar" ? null : "calendar")
              }
            >
              <div className={styles.search_category}>체크아웃</div>
              <div className={styles.search_value}>
                {dateRange[1] ? dateRange[1].toLocaleDateString() : "날짜 추가"}
              </div>
            </div>

            {/* 하나의 공유 달력 */}
            {activeField === "calendar" && (
              <div
                className={styles.calendar_wrapper}
                onClick={handleCalendarClick}
              >
                <SearchCalendar
                  onChange={handleDateChange}
                  value={dateRange}
                  selectRange={true}
                />
              </div>
            )}

            {/* 인원수 */}
            <div
              className={`${styles.search_category_warp} ${styles.guests_warp}`}
              onClick={() =>
                setActiveField(activeField === "guests" ? null : "guests")
              }
            >
              <div className={styles.search_category}>인원수</div>
              <div className={styles.search_value}>
                {guests == 0 ? "게스트 추가" : `${guests} 명`}
              </div>

              {activeField === "guests" && (
                <div className={styles.guests_selector}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 전파 중지
                      setGuests((prev) => Math.max(1, prev - 1));
                    }}
                  >
                    -
                  </button>
                  <span>{guests}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 전파 중지
                      setGuests((prev) => prev + 1);
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* 검색 버튼 */}
            <div className={styles.search_Btn_warp1}>
              <button className={styles.search_Btn1} onClick={handleSearch}>
                <img src={searchIcon} alt="검색" />
              </button>
            </div>
          </div>

          <button className={styles.search_Btn_warp2} onClick={handleSearch}>
            검색하기
          </button>
        </div>
      </div>
      {(searchResults || isLoading) && (
        <AccomSearch accommodations={searchResults} isLoading={isLoading} />
      )}
    </div>
  );
});
