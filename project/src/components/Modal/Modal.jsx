import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// Import required modules
import { Navigation, Pagination } from "swiper/modules";
import { FaMinus, FaPlus } from "react-icons/fa";
import { ShowAlert } from "../../utils/AlertUtils.js";

import "swiper/css";
import styles from "./Modal.module.css";
import icon1 from "./icon/map-pin.png";
import icon2 from "./icon/users.png";
import "./customSwiper.css";
import StyledCalender from "../ModalCalender/StyledCalender";

export default function Modal({ accommodation, onClose }) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(0);
  const [requests, setRequests] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkInDate, setCheckInDate] = useState(null);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [timeSlots, setTimeSlots] = useState({});
  const [showGuestToggle, setShowGuestToggle] = useState(false);
  const [checkInClass, setCheckInClass] = useState("");
  const [checkOutClass, setCheckOutClass] = useState("");
  const [guestClass, setGuestClass] = useState("");

  // TimeSlots 데이터 가져오기
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch(`https://port-0-chonslove-m3xuhnug314b3f1c.sel4.cloudtype.app/accommodations/timeslots?accommodationId=${accommodation._id}`);

        const data = await response.json();
        setTimeSlots(data);
      } catch (error) {
        console.error("TimeSlots 조회 실패:", error);
      }
    };
    fetchTimeSlots();
  }, [accommodation._id]);

  const handlePhotoClick = (index) => setCurrentPhoto(index);

  const guestAlarm = async (reservationData) => {
    try {
      const alarmData = {
        reservationId: reservationData._id,
        url: `chonslove.netlify.app/guest/${reservationData._id}`,
      };

      const response = await fetch("https://port-0-chonslove-m3xuhnug314b3f1c.sel4.cloudtype.app/alarm/request_guest", {
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
      console.log(alarmData);
    } catch (error) {
      console.error("알람 전송 실패:", error);
    }
  };

  const hostAlarm = async (reservationData) => {
    try {
      const alarmData = {
        reservationId: reservationData._id,
        url: `chonslove.netlify.app/host/resve?id=${reservationData._id}`,
      };

      const response = await fetch("https://port-0-chonslove-m3xuhnug314b3f1c.sel4.cloudtype.app/alarm/request_host", {
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
      console.log(alarmData);
    } catch (error) {
      console.error("알람 전송 실패:", error);
    }
  };

  const handleReservation = async () => {
    try {
      if (!user) {
        ShowAlert("info", "", "로그인이 필요한 서비스입니다.");
        navigate("/login");
        return;
      }

      if (guests === 0) {
        ShowAlert("info", "", "인원수를 선택해주세요.");
        return;
      }

      if (!checkIn || !checkOut) {
        ShowAlert("info", "", "체크인/체크아웃 날짜를 선택해주세요.");
        return;
      }

      const reservationData = {
        accommodationId: accommodation._id,
        userId: user._id,
        startDate: new Date(checkIn).toLocaleDateString(),
        endDate: new Date(checkOut).toLocaleDateString(),
        person: parseInt(guests),
        message: requests || "",
      };

      console.log("Sending reservation data:", reservationData);

      const response = await fetch("https://port-0-chonslove-m3xuhnug314b3f1c.sel4.cloudtype.app/reservations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      if (response.ok) {
        ShowAlert("success", "", "예약이 완료되었습니다.");
        setCheckIn("");
        setCheckOut("");
        setGuests(0);
        setRequests("");
        onClose();
        guestAlarm(data);
        hostAlarm(data);
      } else {
        throw new Error(data.message || "예약 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Reservation error:", error);
      setError(error.message);
      ShowAlert("info", "", error.message);
    }
  };

  // 별점 렌더링 함수 (노란색으로 색상 지정)
  const renderStars = (grade) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`${styles.star} ${i < grade ? styles.activeStar : styles.star}`}
        style={{ color: i < grade ? "gold" : "#dddddd" }} // 별 색을 노란색과 회색으로 지정
      >
        ★
      </span>
    ));
  };

  // 평균 별점 계산
  const calculateAverageGrade = () => {
    const grade = accommodation.grade; // accommodation의 grade를 별점으로 사용
    return grade.toFixed(1); // 소수점 첫째 자리까지 계산
  };

  // 리뷰 날짜를 메모이제이션
  const reviewDates = useMemo(() => {
    return accommodation.review.map((_, index) => {
      const today = new Date();
      const randomDays = Math.floor(Math.random() * 30); // 최근 30일 내의 랜덤한 날짜
      const reviewDate = new Date(today);
      reviewDate.setDate(today.getDate() - randomDays);

      return reviewDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    });
  }, []); // 리뷰 개수가 변경될 때만 재계산

  // getReviewDate 함수 수정
  const getReviewDate = (index) => {
    return reviewDates[index];
  };

  // 체크인 날짜 선택 핸들러
  const handleCheckInSelect = (date) => {
    setCheckInDate(date);
    setCheckIn(date.toISOString());
    setShowCheckInCalendar(false);
    setShowCheckOutCalendar(true);
  };

  // 체크아웃 날짜 선택 핸들러
  const handleCheckOutSelect = (date) => {
    setCheckOut(date.toISOString());
    setShowCheckOutCalendar(false);
  };

  // useEffect로 달력 상태 변경 감지
  useEffect(() => {
    setCheckInClass(showCheckInCalendar ? styles.true : "");
  }, [showCheckInCalendar]);

  useEffect(() => {
    setCheckOutClass(showCheckOutCalendar ? styles.true : "");
  }, [showCheckOutCalendar]);

  useEffect(() => {
    setGuestClass(showGuestToggle ? styles.true : "");
  }, [showGuestToggle]);

  return createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        {/* 숙소 이미지 */}
        <div className={styles.headerSection}>
          <Swiper
            pagination={{
              type: "fraction",
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className={styles.mySwiper}
          >
            {accommodation.photo.map((photo, index) => (
              <SwiperSlide key={index}>
                <div className={styles.imageSection}>
                  <img src={`/img/${accommodation.accommodation_num}/${photo}`} alt={`숙소 이미지 ${index + 1}`} className={styles.mainImage} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 숙소정보, 예약폼 */}
        <div className={styles.contentWrapper}>
          {/* 숙소 정보*/}
          <div className={styles.infoSection}>
            <div className={styles.infoSection_warp}>
              <h2>{accommodation.name}</h2>
              <p className={styles.description}>{accommodation.explain}</p>

              <div className={styles.locationAndDetails}>
                <p className={styles.detail}>
                  <img src={icon1} alt="지도 아이콘" className={styles.icon} />
                  {accommodation.address}
                </p>
                <p className={styles.detail}>
                  <img src={icon2} alt="인원 아이콘" className={styles.icon} />
                  기준 {accommodation.person}명 / 최대 {accommodation.max_person} 명
                </p>
              </div>
            </div>
            <p className={styles.price}>₩ {accommodation.price.toLocaleString()}</p>
          </div>

          {/* 예약폼 */}
          <div className={styles.reservationSection}>
            <div className={styles.reser_box}>
              <div className={styles.dateSection}>
                <div
                  onClick={() => {
                    setShowCheckInCalendar(!showCheckInCalendar);
                    setShowCheckOutCalendar(false);
                    setShowGuestToggle(false);
                  }}
                  className={`${styles.inputGroup} ${styles.checkIn} ${checkInClass}`}
                >
                  <div className={styles.form_category}>체크인</div>
                  <div className={styles.form_value}>{checkIn ? new Date(checkIn).toLocaleDateString() : "날짜 추가"}</div>
                </div>

                {showCheckInCalendar && (
                  <div className={styles.calendar_wrapper}>
                    <StyledCalender onChange={handleCheckInSelect} value={checkIn ? new Date(checkIn) : null} isCheckIn={true} timeSlots={timeSlots} />
                  </div>
                )}

                <div
                  onClick={() => {
                    setShowCheckOutCalendar(!showCheckOutCalendar);
                    setShowCheckInCalendar(false);
                    setShowGuestToggle(false);
                  }}
                  className={`${styles.inputGroup} ${styles.checkOut} ${checkOutClass}`}
                >
                  <div className={styles.form_category}>체크아웃</div>
                  <div className={styles.form_value}>{checkOut ? new Date(checkOut).toLocaleDateString() : "날짜 추가"}</div>
                </div>

                {showCheckOutCalendar && (
                  <div className={styles.calendar_wrapper}>
                    <StyledCalender
                      onChange={handleCheckOutSelect}
                      value={checkOut ? new Date(checkOut) : null}
                      isCheckIn={false}
                      selectedCheckIn={checkIn ? new Date(checkIn) : null}
                      timeSlots={timeSlots}
                    />
                  </div>
                )}

                <div
                  className={`${styles.inputGroup} ${guestClass}`}
                  onClick={() => {
                    setShowGuestToggle(!showGuestToggle);
                    setShowCheckInCalendar(false);
                    setShowCheckOutCalendar(false);
                  }}
                >
                  <div className={styles.form_category}>인원수</div>
                  <div className={styles.form_value}>{guests === 0 ? "게스트 추가" : `${guests}명`}</div>

                  {showGuestToggle && (
                    <div className={styles.guestToggleMenu}>
                      <div className={styles.guestToggleContent}>
                        <span>성인</span>
                        <div className={styles.guestsToggle}>
                          <button
                            className={styles.toggleBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setGuests((prev) => Math.max(1, prev - 1));
                            }}
                            disabled={guests <= 1}
                          >
                            -
                          </button>
                          <span className={styles.guestCount}>{guests}명</span>
                          <button
                            className={styles.toggleBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setGuests((prev) => Math.min(accommodation.max_person, prev + 1));
                            }}
                            disabled={guests >= accommodation.max_person}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className={styles.guestToggleFooter}>
                        <span className={styles.maxGuests}>최대 {accommodation.max_person}명</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.inputText}>
                <textarea placeholder="전달사항이 있으시면 입력해주세요." onChange={(e) => setRequests(e.target.value)}></textarea>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.reserveButton} onClick={handleReservation}>
              예약 신청하기
            </button>
          </div>
        </div>

        {/* 리뷰 */}
        <div className={styles.reviewSection}>
          <div className={styles.reviewTitle}>
            <div className={styles.reviewH3}>후기</div>
            <span className={styles.starAndNumber}>
              {/* 별 하나 표시, 색을 노란색으로 설정 */}
              <span className={styles.star} style={{ color: "gold" }}>
                {"★"}
              </span>
              <span className={styles.averageRating}>
                {/* 평균 별점 숫자 표시 */}
                {calculateAverageGrade()} ({accommodation.review.length})
              </span>
            </span>
          </div>
          <Swiper
            slidesPerView={3} // 한 번에 3개 리뷰 표시
            spaceBetween={20} // 리뷰 간 간격 설정
            modules={[]} // Pagination 모듈 제거
            className={styles.mySwiper}
            breakpoints={{
              1200: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 10,
              },

              530: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              230: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
            }}
          >
            {accommodation.review.map((review, index) => (
              <SwiperSlide key={index}>
                <div className={styles.reviewItem}>
                  <div className={styles.starRating}>
                    <div className={styles.starsWrapper}>
                      {/* 별점 표시 (여전히 별점 개수 표시) */}
                      {renderStars(accommodation.grade)}
                    </div>
                    <div className={styles.reviewDate}>
                      {/* 별점 옆에 등록일 표시 */}
                      {getReviewDate(index)} {/* 리뷰 날짜 표시 */}
                    </div>
                  </div>
                  <p>{review}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
