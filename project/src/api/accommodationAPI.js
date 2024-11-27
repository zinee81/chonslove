import { apiClient } from "./apiClient";

export const accommodationAPI = {
  // 검색
  search: async (queryString) => {
    try {
      return await apiClient.get(`/accommodations/search?${queryString}`);
    } catch (error) {
      throw new Error(error.message || "검색 중 오류가 발생했습니다.");
    }
  },

  // 최신 숙소
  getRecentAccommodations: () => {
    return apiClient.get("/accommodations/top_date");
  },

  // 인기 숙소
  getTopGradeAccommodations: () => {
    return apiClient.get("/accommodations/top_grade");
  },

  // 숙소별 타임슬롯 조회 추가
  getAccommodationTimeSlots: async (accommodationId) => {
    try {
      const response = await apiClient.get(
        `/accommodations/timeslots?accommodationId=${accommodationId}`
      );
      return response || {}; // 예약 정보가 없으면 빈 객체 반환
    } catch (error) {
      if (
        error.response?.status === 500 &&
        error.response?.data?.message === "예약 정보가 없습니다."
      ) {
        return {}; // 예약 정보가 없는 경우 빈 객체 반환
      }
      throw new Error(error.message || "타임슬롯 조회 중 오류가 발생했습니다.");
    }
  },

  // 숙소 상세 정보 조회
  getAccommodationDetail: (accommodationId) => {
    return apiClient.get(
      `/accommodations/detail?accommodationId=${accommodationId}`
    );
  },

  // 숙소의 예약 목록 조회
  getAccommodationReservations: (accommodationId) => {
    return apiClient.get(
      `/accommodations/reservations?accommodationId=${accommodationId}`
    );
  },
};
