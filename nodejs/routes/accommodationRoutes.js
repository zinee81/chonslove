// 숙소 관련 API

const express = require("express");
const router = express.Router();
const Accommodation = require("../schema/accommodationSchema.js");
const Reservation = require("../schema/reservation.js");
const TimeSlot = require("../schema/timeSlot.js");
// const accommodationSchema = require("../models/accommodationSchema.js");

/**
 * 숙소 목록
 */
router.get("/list", async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.status(200).json(accommodations);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * 숙소 목록 등록일순으로
 */
router.get("/top_date", async (req, res) => {
  try {
    const accommodations = await Accommodation.find()
      .sort({ create_date: -1 })
      .limit(8);

    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 숙소 목록 평점순으로
 */
router.get("/top_grade", async (req, res) => {
  try {
    const accommodations = await Accommodation.find()
      .sort({ grade: -1 })
      .limit(8);

    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 숙소 상세정보
 */
router.get("/detail", async (req, res) => {
  try {
    const accommodationId = req.query.accommodationId;

    const accommodationData = await Accommodation.findOne({
      _id: accommodationId,
    });
    if (accommodationData) {
      res.status(200).json(accommodationData);
    } else {
      res.status(500).json({ message: "숙소 정보가 없습니다." });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * 숙소의 예약 timeslots (전체 예약의 모든 timeslot을 반환함)
 */
router.get("/timeslots", async (req, res) => {
  try {
    const accommodationId = req.query.accommodationId;

    // 1. 숙소의 모든 예약 조회
    const reservationData = await Reservation.find({
      accommodationId: accommodationId,
      endDate: { $gte: new Date() },
    });

    console.log(`숙소 ${accommodationId}의 예약 수:`, reservationData.length);
    // let timeSlotData = [];

    if (reservationData.length > 0) {
      // 2. 예약 ID 목록 생성
      const reservationIds = reservationData.map((res) => res._id.toString());

      // 3. TimeSlots에서 해당 예약들의 타임슬롯 조회
      const timeSlots = await TimeSlot.find({
        reservationId: { $in: reservationIds },
      }).sort({ date: 1 });

      console.log("조회된 타임슬롯 수:", timeSlots.length);

      // 4. 날짜별 예약 상태 생성
      const dateAvailability = {};

      timeSlots.forEach((slot) => {
        const dateStr = new Date(slot.date).toISOString().split("T")[0];

        if (!dateAvailability[dateStr]) {
          dateAvailability[dateStr] = {
            checkOut: true, // 기본값: 체크아웃 가능
            checkIn: true, // 기본값: 체크인 가능
          };
        }

        // AM 예약 확인
        if (slot.am && reservationIds.includes(slot.reservationId.toString())) {
          dateAvailability[dateStr].checkOut = false; // AM이 예약되어 있으면 체크아웃 불가
        }

        // PM 예약 확인
        if (slot.pm && reservationIds.includes(slot.reservationId.toString())) {
          dateAvailability[dateStr].checkIn = false; // PM이 예약되어 있으면 체크인 불가
        }

        // 둘 다 예약된 경우 모두 불가능 처리
        if (
          slot.am &&
          slot.pm &&
          reservationIds.includes(slot.reservationId.toString()) &&
          reservationIds.includes(slot.reservationId.toString())
        ) {
          dateAvailability[dateStr].checkOut = false;
          dateAvailability[dateStr].checkIn = false;
        }
      });

      console.log("날짜별 예약 상태:", dateAvailability);
      res.status(200).json(dateAvailability);

      // // 모든 reservationId에 대해 timeSlot을 조회
      // const timeSlotPromises = reservationData.map(async (i) => {
      //   const timeSlots = await TimeSlot.find({
      //     $or: [{ "am.reservationId": i._id }, { "pm.reservationId": i._id }],
      //   });
      //   return timeSlots; // 각 예약에 대한 timeSlot 반환
      // });

      // // 모든 Promise가 완료될 때까지 기다림
      // timeSlotData = await Promise.all(timeSlotPromises);

      // res.status(200).json({ reservationData: reservationData, timeSlotData: timeSlotData });
    } else {
      res.json({ message: "예약 정보가 없습니다." });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * 숙소의 예약 정보
 */
router.get("/reservations", async (req, res) => {
  try {
    const accommodationId = req.query.accommodationId;

    // 1. 숙소의 모든 예약 조회
    const reservationDatas = await Reservation.find({
      accommodationId: accommodationId,
    });

    if (reservationDatas.length > 0) {
      // 2. 예약 ID 목록 생성
      const reservationPromises = reservationDatas.map(async (res) => {
        const data = await Reservation.findOne({ _id: res._id })
          .populate("accommodationId", "name address phone price region")
          .populate("userId", "name phone")
          .sort({ startDate: -1 });
        return data;
      });

      // 모든 프로미스가 완료될 때까지 기다림
      const reservationData = await Promise.all(reservationPromises);

      res.status(200).json({ reservationData: reservationData });
    } else {
      res.status(500).json({ message: "예약 정보가 없습니다." });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * 숙소 검색
 */
router.get("/search", async (req, res) => {
  try {
    console.log("검색 요청 받음:", req.query);
    const { region, checkIn, checkOut, person } = req.query;

    // 1. 기본 숙소 조건 검색 (지역, 인원)
    let query = {};

    if (region && region !== "전체") {
      query.region = region;
    }

    if (person) {
      // query.person = { $lte: parseInt(person) };
      query.max_person = { $gte: parseInt(person) };
    }

    // 모든 숙소 검색
    const accommodations = await Accommodation.find(query);
    console.log("기본 조건 검색된 숙소 수:", accommodations.length);

    // 날짜 조건이 없으면 바로 결과 반환
    if (!checkIn || !checkOut) {
      return res.status(200).json(accommodations);
    }

    // 2. 해당 기간의 타임슬롯 검색
    const timeSlots = await TimeSlot.find({
      date: { $gte: new Date(checkIn), $lte: new Date(checkOut) },
    });
    console.log("검색된 타임슬롯 수:", timeSlots.length);

    // 3. 예약된 reservationId 수집
    const reservationIds = new Set();

    timeSlots.forEach((slot) => {
      const slotDate = new Date(slot.date).toISOString().split("T")[0];

      // 체크인 날짜는 PM만 확인
      if (slotDate === checkIn) {
        if (slot.pm) {
          reservationIds.add(slot.reservationId.toString());
        }
      }
      // 체크아웃 날짜는 AM만 확인
      else if (slotDate === checkOut) {
        if (slot.am) {
          reservationIds.add(slot.reservationId.toString());
        }
      }
      // 중간 날짜는 AM, PM 모두 확인
      else {
        if (slot.am) {
          reservationIds.add(slot.reservationId.toString());
        }
        if (slot.pm) {
          reservationIds.add(slot.reservationId.toString());
        }
      }
    });

    console.log("예약된 reservationIds:", Array.from(reservationIds));

    // 4. 예약된 숙소 ID 찾기
    const reservations = await Reservation.find({
      _id: { $in: Array.from(reservationIds) },
    });

    const bookedAccommodationIds = new Set(
      reservations.map((res) => res.accommodationId.toString())
    );

    console.log("예약된 숙소 IDs:", Array.from(bookedAccommodationIds));

    // 5. 예약된 숙소 제외하고 결과 반환

    const availableAccommodations = accommodations.filter(
      (acc) => !bookedAccommodationIds.has(acc._id.toString())
    );
    console.log("최종 이용 가능한 숙소 수:", availableAccommodations.length);
    res.status(200).json(availableAccommodations);
  } catch (error) {
    console.error("검색 에러:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
