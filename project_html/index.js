document.querySelectorAll(".FAQ_question").forEach((faq) => {
  faq.addEventListener("click", function () {
    const answer = this.nextElementSibling; // 클릭한 질문의 바로 다음 형제 요소인 답변
    const img = this.querySelector("img"); // 클릭한 질문 내부의 이미지

    // 답변을 보이거나 숨기기
    if (answer.style.display === "block") {
      answer.style.display = "none";
      img.style.transform = "rotate(0deg)"; // 화살표를 원래대로 돌리기
    } else {
      answer.style.display = "block";
      img.style.transform = "rotate(180deg)"; // 화살표를 180도 회전시켜서 아래로 표시
    }
  });
});
