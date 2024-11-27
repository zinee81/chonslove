const BASE_URL = import.meta.env.PROD
  ? "/api" // 프로덕션 환경
  : "http://152.69.234.13:8080"; // 개발 환경

// 기본 fetch 함수 래퍼
export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error("API 요청 실패");
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("API 요청 실패");
    return response.json();
  },

  async put(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("API 요청 실패");
    return response.json();
  },

  async delete(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("API 요청 실패");
    return response.json();
  },
};
