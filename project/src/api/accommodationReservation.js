export const createReservation = async (reservationData) => {
  try {
    const response = await fetch(`https://port-0-chonslove-m3xuhnug314b3f1c.sel4.cloudtype.app/reservations/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      throw new Error("예약 생성 실패");
    }

    return response.json();
  } catch (error) {
    console.error("예약 생성 오류:", error);
    throw error; // 에러를 상위로 전파
  }
};
