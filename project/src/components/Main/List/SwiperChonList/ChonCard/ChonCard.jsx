import { useState } from "react";
import styles from "./ChonCard.module.css";
import Modal from "../../../../Modal/Modal";

export default function ChonCard({ accommodations }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!accommodations) return null;

  const backgroundStyle = {
    backgroundImage: `url(/img/${accommodations.accommodation_num}/${accommodations.photo[0]})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
  };

  const handleImageError = (e) => {
    const element = e.target;
    element.style.backgroundImage = "url(/img/default.jpg)";
    console.log("이미지 로드 실패");
  };

  return (
    <>
      <div className={styles.card} onClick={() => setIsModalOpen(true)}>
        <div className={styles.card_img} style={backgroundStyle} onError={handleImageError}></div>
        <div className={styles.chon_address}>
          <div className={styles.address}>{accommodations.address}</div>
          <div>
            <span>
              <img src="/img/star.png" alt="star" />
            </span>
            <span>
              {accommodations.grade}({accommodations.review.length})
            </span>
          </div>
        </div>
        <div className={styles.chon_name}>{accommodations.name}</div>
      </div>

      {isModalOpen && <Modal accommodation={accommodations} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
