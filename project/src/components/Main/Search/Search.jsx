import { useState, forwardRef } from "react";
import SearchCalendar from "../../SearchCalender/SearchCalender";
import styles from "./Search.module.css";
import searchIcon from "/img/searchIcon.png";
import { accommodationAPI } from "../../../api/accommodationAPI";
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

// 날짜 형식 변환 유틸리티 함수
const formatDate = (date) => {
  if (!date) return "";
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kstDate.toISOString().split("T")[0];
};

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
    setIsLoading(true);

    try {
      // 유효성 검사
      if (!guests || guests <= 0) {
        ShowAlert("info", "", "인원 수를 입력해주세요.");
        return;
      }

      if (!selectedRegion) {
        ShowAlert("info", "", "지역을 선택해주세요.");
        return;
      }

      if (!dateRange[0] || !dateRange[1]) {
        ShowAlert("info", "", "날짜를 선택해주세요.");
        return;
      }

      // 검색 파라미터 정제
      const searchParams = {
        region: selectedRegion === "전체" ? "" : selectedRegion,
        person: guests.toString(),
        checkIn: formatDate(dateRange[0]),
        checkOut: formatDate(dateRange[1]),
      };

      // URLSearchParams에서 빈 값("") 제거
      const queryString = new URLSearchParams(
        Object.entries(searchParams).filter(([_, value]) => value !== "")
      ).toString();

      const results = await accommodationAPI.search(queryString);
      setSearchResults(results);
    } catch (error) {
      console.error("검색 오류:", error);
      setError(error.message);
      ShowAlert("info", "", error.message);
    } finally {
      setIsLoading(false);
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
