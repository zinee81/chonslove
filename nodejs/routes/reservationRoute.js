const express = require("express");
const router = express.Router();
const Reservation = require("../schema/reservation");
const TimeSlot = require("../schema/timeSlot");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
// const moment = require("moment");

/**
 * 예약 조회 (게스트 예약확인)
 */
router.get("/", async (req, res) => {
  try {
    // 예약 id를 조회해서 예약 내역을 가져옴
    const reservationId = req.query.reservationId;
    const reservation = await Reservation.findOne({ _id: reservationId }).populate("accommodationId", "name address phone price region").populate("userId", "name phone").sort({ startDate: -1 });
    // const reservations = await Reservation.find({ accommodationId: accommodationId }).populate("accommodationId", "name address price region").populate("userId", "name phone").sort({ startDate: -1 });

    if (reservation) {
      res.status(200).json(reservation);
    } else {
      res.status(500).json({ message: "예약 내역이 없습니다." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 예약 생성 (예약신청) (timeSlots에 false로 데이터 추가)
 */
router.post("/create", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { accommodationId, userId, startDate, endDate, person, message } = req.body;
    const nowDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000); // 대한민국 시간

    // 2. 예약 생성(reservation 에 insert)
    const reservation = await Reservation.create({
      accommodationId: accommodationId,
      userId: userId,
      startDate: startDate,
      endDate: endDate,
      person: person,
      message: message,
      state: "await",
      createdAt: nowDate,
    });

    // timeSlots 컬렉션에 예약추가
    const start = reservation.startDate;
    const end = reservation.endDate;

    // 해당 기간의 모든 날짜 생성
    const dates = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // TimeSlot 생성
    for (const date of dates) {
      const timeSlot = new TimeSlot({ reservationId: reservation._id, date });

      timeSlot.am = false;
      timeSlot.pm = false;

      await timeSlot.save();
    }

    await session.commitTransaction();
    res.status(200).json(reservation);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

/**
 * 예약승인(확정)
 * 예약번호(reservationId),체크인 날짜(startDate),체크아웃 날짜(endDate)
 */
router.put("/confirm/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reservationId = req.params.id;

    // reservations 컬렉션에서 해당 예약의 state를 "comfirm" 으로 변경
    const updateReservation = await Reservation.findOneAndUpdate({ _id: new ObjectId(reservationId) }, { $set: { state: "confirm" } });

    if (!updateReservation) {
      return res.status(404).json({ message: "예약을 찾을 수 없습니다." });
    } else {
      // timeSlots 컬렉션에 예약추가
      const start = updateReservation.startDate;
      const end = updateReservation.endDate;

      // 해당 기간의 모든 날짜 생성
      const dates = [];
      let currentDate = new Date(start);
      while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // TimeSlot 업데이트
      for (const date of dates) {
        let timeSlot = await TimeSlot.findOne({
          reservationId: reservationId,
          date,
        });

        if (timeSlot) {
          if (date.getTime() === start.getTime()) {
            timeSlot.pm = true;
          } else if (date.getTime() === end.getTime()) {
            timeSlot.am = true;
          } else {
            timeSlot.am = true;
            timeSlot.pm = true;
          }
        } else {
          return res.status(404).json({ message: "예약을 찾을 수 없습니다." });
        }

        await timeSlot.save();
      }
    }
    res.status(200).json({ message: "예약이 확정 되었습니다." });

    await session.commitTransaction();
    return;
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({ message: e.message });
  } finally {
    session.endSession();
  }
});

/**
 * 예약거절 (예약번호(reservationId))
 */
router.put("/decline/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reservationId = req.params.id;
    console.log("reservationId : ", reservationId);

    const declineReservation = await Reservation.findOneAndUpdate({ _id: new ObjectId(reservationId) }, { $set: { state: "decline" } });

    res.status(200).json({ message: "예약이 거절 되었습니다." });

    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({ message: e.message });
  } finally {
    session.endSession();
  }
});

/**
 * 예약 취소 (삭제)
 */
router.put("/delete/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reservationId = req.params.id;

    const deleteReservation = await Reservation.findOneAndUpdate({ _id: new ObjectId(reservationId) }, { $set: { state: "delete" } });

    if (!deleteReservation) {
      throw new Error("예약을 찾을 수 없습니다.");
    } else {
      // 1. TimeSlot에서 예약 정보 수정
      const deleteResult = await TimeSlot.updateMany(
        { reservationId: new ObjectId(reservationId) },
        {
          $set: {
            am: false,
            pm: false,
          },
        },
        { session }
      );

      console.log("TimeSlot update result:", deleteResult); // 디버깅용
    }

    await session.commitTransaction();

    res.status(200).json({
      message: "예약이 취소되었습니다",
      deleteReservation: deleteReservation,
    });
  } catch (error) {
    console.error("Delete error:", error); // 디버깅용
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// for (const reservationId of reservationIds) {
//   // 예약 가능 여부 확인
//   for (const date of dates) {
//     const timeSlot = await TimeSlot.findOne({ reservationId: reservationId, date });
//     if (timeSlot) {
//       if (date.getTime() === start.getTime() && timeSlot.pm.isReserved) {
//         throw new Error("체크인 날짜 PM이 이미 예약되어 있습니다.");
//       }
//       if (date.getTime() === end.getTime() && timeSlot.am.isReserved) {
//         throw new Error("체크아웃 날짜 AM이 이미 예약되어 있습니다.");
//       }
//       if (date.getTime() !== start.getTime() && date.getTime() !== end.getTime()) {
//         if (timeSlot.am.isReserved || timeSlot.pm.isReserved) {
//           throw new Error(`${date.toISOString().split("T")[0]} 날짜에 이미 예약이 있습니다.`);
//         }
//       }
//     }
//   }
// }

// 예약 수정
router.put("/update/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. 기존 예약 정보 조회
    const oldReservation = await Reservation.findById(id);
    if (!oldReservation) {
      throw new Error("예약을 찾을 수 없습니다");
    }

    // 2. 기존 타임슬롯에서 예약 정보 제거
    await TimeSlot.updateMany(
      {
        date: {
          $gte: oldReservation.startDate,
          $lte: oldReservation.endDate,
        },
        $or: [{ "am.reservationId": oldReservation._id }, { "pm.reservationId": oldReservation._id }],
      },
      {
        $set: {
          "am.isReserved": false,
          "am.reservationId": null,
          "pm.isReserved": false,
          "pm.reservationId": null,
        },
      },
      { session }
    );

    // 3. 새로운 날짜로 예약 수정
    const updatedReservation = await Reservation.findByIdAndUpdate(id, { startDate: start, endDate: end }, { new: true, session });

    // 4. 새로운 타임슬롯 생성 또는 업데이트
    const dates = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    for (const date of dates) {
      let timeSlot = await TimeSlot.findOne({ date }).session(session);
      if (!timeSlot) {
        timeSlot = new TimeSlot({ date });
      }

      // 체크인 날짜인 경우
      if (date.getTime() === start.getTime()) {
        timeSlot.pm.isReserved = true;
        timeSlot.pm.reservationId = updatedReservation._id;
      }
      // 체크아웃 날짜인 경우
      else if (date.getTime() === end.getTime()) {
        timeSlot.am.isReserved = true;
        timeSlot.am.reservationId = updatedReservation._id;
      }
      // 중간 날짜들
      else {
        timeSlot.am.isReserved = true;
        timeSlot.pm.isReserved = true;
        timeSlot.am.reservationId = updatedReservation._id;
        timeSlot.pm.reservationId = updatedReservation._id;
      }

      await timeSlot.save({ session });
    }

    await session.commitTransaction();
    res.status(200).json(updatedReservation);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
