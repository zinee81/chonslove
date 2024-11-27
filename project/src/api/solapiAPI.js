import { apiClient } from "./apiClient";

export const solapiAPI = {
  // 예약알림신청 게스트 알림톡
  sendRequestGuest: (data) => {
    return apiClient.post("/alarm/request_guest", data);
  },

  // 예약알림신청 호스트 알림톡
  sendRequestHost: (data) => {
    return apiClient.post("/alarm/request_host", data);
  },

  // 예약확정 게스트 알림톡
  sendConfirm: (data) => {
    return apiClient.post("/alarm/confirm", data);
  },

  // 예약거절 게스트 알림톡
  sendDecline: (data) => {
    return apiClient.post("/alarm/decline", data);
  },
};
