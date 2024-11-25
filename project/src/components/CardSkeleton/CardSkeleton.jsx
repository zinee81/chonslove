import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./CardSkeleton.module.css";
const CardSkeleton = () => {
  return (
    <div className={styles.skeleton_card}>
      <div className={styles.skeleton_card_img}>
        <Skeleton height="100%" />
      </div>
      <div className={styles.skeleton_chon_address}>
        <div className={styles.skeleton_address}>
          <Skeleton height={20} />
        </div>
        <div className={styles.skeleton_star}>
          <Skeleton height={20} />
        </div>
      </div>
      <div className={styles.skeleton_chon_name}>
        <Skeleton height={20} />
      </div>
    </div>
  );
};

export default CardSkeleton;
