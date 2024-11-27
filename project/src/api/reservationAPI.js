import { apiClient } from "./apiClient";

export const reservationAPI = {
  // 예약 조회 (게스트 예약확인)
  getReservation: (reservationId) => {
    return apiClient.get(`/reservations?reservationId=${reservationId}`);
  },

  // 예약 생성 (예약신청)
  createReservation: (data) => {
    return apiClient.post("/reservations/create", data);
  },

  // 예약 승인(확정)
  confirmReservation: (reservationId) => {
    return apiClient.put(`/reservations/confirm/${reservationId}`);
  },

  // 예약 거절
  declineReservation: (reservationId) => {
    return apiClient.put(`/reservations/decline/${reservationId}`);
  },

  // 예약 취소 (삭제)
  deleteReservation: (reservationId) => {
    return apiClient.put(`/reservations/delete/${reservationId}`);
  },

  // 예약 수정
  updateReservation: (reservationId, data) => {
    return apiClient.put(`/reservations/update/${reservationId}`, data);
  },
};
