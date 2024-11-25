// routes/solapiRoutes.js
const express = require("express");
const router = express.Router();
const Reservation = require("../schema/reservation.js");
const { SolapiMessageService } = require("solapi");

// API 키와 시크릿 키를 사용하여 메시지 서비스 인스턴스 생성
const api_key = process.env.API_KEY || "";
const api_secret = process.env.API_SECRET || "";
const messageService = new SolapiMessageService(api_key, api_secret);

// 예약알림신청 게스트 알림톡 메시지 발송
router.post("/request_guest", async (req, res) => {
  const { reservationId, url, disableSms } = req.body;
  try {
    const data = await Reservation.findOne({ _id: reservationId }).populate("accommodationId", "name phone").populate("userId", "name phone");

    const response = await messageService.send({
      to: data.userId.phone, // 게스트 전화번호
      from: process.env.SOLAPI_PHONE, // 발신번호를 넣는곳이나 솔라피에서 등록을 해야함. 문자로 대체 발송될 경우를 위해서.
      kakaoOptions: {
        pfId: process.env.SOLAPI_PFID,
        templateId: process.env.REQUEST_G_TEMPLATE_ID,
        variables: {
          "#{userName}": data.userId.name || "",
          "#{accommodationName}": data.accommodationId.name || "",
          "#{url}": url || "",
        },
        disableSms: disableSms || false, // 기본값(false) - 알림톡 실패시 SMS로 대체 발송함
      },
    });

    res.json({
      success: true,
      message: "예약신청알림(게스트) 전송 성공",
      data: response,
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.status === 401 ? "인증 실패" : "메시지 전송 실패",
      error: error.message,
    });
  }
});

// 예약알림신청 호스트 알림톡 메시지 발송
router.post("/request_host", async (req, res) => {
  const { reservationId, url, disableSms } = req.body;
  try {
    const data = await Reservation.findOne({ _id: reservationId }).populate("accommodationId", "name phone").populate("userId", "name phone");

    const response = await messageService.send({
      to: data.accommodationId.phone, // 호스트 전화번호
      from: process.env.SOLAPI_PHONE, // 발신번호를 넣는곳이나 솔라피에서 등록을 해야함. 문자로 대체 발송될 경우를 위해서.
      kakaoOptions: {
        pfId: process.env.SOLAPI_PFID,
        templateId: process.env.REQUEST_H_TEMPLATE_ID,
        variables: {
          "#{accommodationName}": data.accommodationId.name || "",
          "#{userName}": data.userId.name || "",
          "#{reservationStartDate}": data.startDate.toISOString().split("T")[0] || "",
          "#{reservationEndDate}": data.endDate.toISOString().split("T")[0] || "",
          "#{reservationPerson}": data.person || "",
          "#{url}": url || "",
        },
        disableSms: disableSms || false, // 기본값(false) - 알림톡 실패시 SMS로 대체 발송함
      },
    });

    res.json({
      success: true,
      message: "예약신청알림(호스트) 전송 성공",
      data: response,
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.status === 401 ? "인증 실패" : "메시지 전송 실패",
      error: error.message,
    });
  }
});

// 예약확정 게스트 알림톡 메시지 발송
router.post("/confirm", async (req, res) => {
  const { reservationId, url, disableSms } = req.body;
  try {
    const data = await Reservation.findOne({ _id: reservationId }).populate("accommodationId", "name address phone ").populate("userId", "name phone");

    const response = await messageService.send({
      to: data.userId.phone, // 게스트 전화번호
      from: process.env.SOLAPI_PHONE, // 발신번호를 넣는곳이나 솔라피에서 등록을 해야함. 문자로 대체 발송될 경우를 위해서.
      kakaoOptions: {
        pfId: process.env.SOLAPI_PFID,
        templateId: process.env.CONFIRM_TEMPLATE_ID,
        variables: {
          "#{userName}": data.userId.name || "",
          "#{accommodationName}": data.accommodationId.name || "",
          "#{reservationStartDate}": data.startDate.toISOString().split("T")[0] || "",
          "#{reservationEndDate}": data.endDate.toISOString().split("T")[0] || "",
          "#{accommodationAddress}": data.accommodationId.address || "",
          "#{accommodationPhone}": data.accommodationId.phone || "",
          "#{url}": url || "",
        },
        disableSms: disableSms || false, // 기본값(false) - 알림톡 실패시 SMS로 대체 발송함
      },
    });

    res.json({
      success: true,
      message: "예약확정알림(게스트) 전송 성공",
      data: response,
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.status === 401 ? "인증 실패" : "메시지 전송 실패",
      error: error.message,
    });
  }
});

// 예약거절 게스트 알림톡 메시지 발송
router.post("/decline", async (req, res) => {
  const { reservationId, disableSms } = req.body;
  try {
    const data = await Reservation.findOne({ _id: reservationId }).populate("accommodationId", "name").populate("userId", "name phone");

    const response = await messageService.send({
      to: data.userId.phone, // 게스트 전화번호
      from: process.env.SOLAPI_PHONE, // 발신번호를 넣는곳이나 솔라피에서 등록을 해야함. 문자로 대체 발송될 경우를 위해서.
      kakaoOptions: {
        pfId: process.env.SOLAPI_PFID,
        templateId: process.env.DECLINE_TEMPLATE_ID,
        variables: {
          "#{userName}": data.userId.name || "",
          "#{accommodationName}": data.accommodationId.name || "",
        },
        disableSms: disableSms || false, // 기본값(false) - 알림톡 실패시 SMS로 대체 발송함
      },
    });

    res.json({
      success: true,
      message: "예약거절알림(게스트) 전송 성공",
      data: response,
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.status === 401 ? "인증 실패" : "메시지 전송 실패",
      error: error.message,
    });
  }
});

module.exports = router;
