import { useState } from "react";

import styles from "./Faq.module.css";
import faqIcon from "/img/chevron-down.png";

export default function Faq() {
  const faqData = [
    {
      question: "촌스럽게는 어떤 사이트 인가요?",
      answer:
        "촌스럽게는 시골에서의 휴식과 체험을 제공하는 플랫폼으로, 자연 속에서 힐링할 수 있는 숙소와 여행 정보를 제공합니다.",
    },
    {
      question: "촌캉스가 뭔가요?",
      answer:
        "촌캉스는 도시를 떠나 시골에서 자연과 함께하는 휴가를 뜻하는 말로, 여유로운 시간을 즐길 수 있는 활동을 의미합니다.",
    },
    {
      question: "예약은 어떻게 진행되나요?",
      answer:
        "원하는 숙소의 상세 페이지에서 날짜와 인원수를 입력하고 문의사항이나 하실 말씀과 함께 예약 신청 하시면됩니다. 예약 진행 상황은 알림톡으로 확인 가능합니다.",
    },
    {
      question: "숙소 리뷰는 어디서 볼 수 있나요?",
      answer:
        "각 숙소의 상세 페이지에서 고객 리뷰와 평점을 확인할 수 있습니다.",
    },
    {
      question: "해당 숙소의 규칙은 어떻게 되나요?",
      answer:
        "숙소마다 규정이 다르며, 각 숙소의 상세페이지에서 확인할 수 있고 더 자세한 내용은 호스트에게 문의하세요.",
    },
  ];

  const [opened, setOpened] = useState(new Array(faqData.length).fill(false));

  const toggleAnswer = (index) => {
    const updatedOpened = [...opened];
    updatedOpened[index] = !updatedOpened[index];
    setOpened(updatedOpened);
  };

  return (
    <div className={styles.FAQ}>
      <div className="w1200">
        <div className={styles.FAQ_title}>FAQ</div>
        <div className={styles.FAQ_warp}>
          {faqData.map((faq, index) => (
            <div className={styles.FAQ_item} key={index}>
              <div
                className={styles.FAQ_question}
                onClick={() => toggleAnswer(index)}
              >
                <div>{faq.question}</div>
                <img
                  src={faqIcon}
                  alt="Toggle"
                  style={{
                    transform: opened[index]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </div>

              <div
                className={styles.FAQ_answer}
                style={{ display: opened[index] ? "block" : "none" }}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
