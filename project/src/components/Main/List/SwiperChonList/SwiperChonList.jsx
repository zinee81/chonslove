import Styles from "./SwiperChonList.module.css";
import ChonCard from "./ChonCard/ChonCard.jsx";
import CardSkeleton from "../../../CardSkeleton/CardSkeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import required modules
import { Navigation, Pagination } from "swiper/modules";

import { useState, useEffect } from "react";

export default function SwiperChonList({ accommodations, isLoading }) {
  const [skeletonCount, setSkeletonCount] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1000) {
        setSkeletonCount(4);
      } else if (width > 710) {
        setSkeletonCount(3);
      } else if (width > 400) {
        setSkeletonCount(2);
      } else {
        setSkeletonCount(1);
      }
    };

    // 초기 실행
    handleResize();

    // resize 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const skeletonArray = Array(skeletonCount).fill(null);

  if (isLoading) {
    return (
      <div className={Styles.skeletonContainer}>
        {skeletonArray.map((_, index) => (
          <div key={`skeleton-${index}`} className={Styles.skeletonItem}>
            <CardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        loop={false}
        navigation={true}
        modules={[Pagination, Navigation]}
        className={Styles.mySwiper}
        breakpoints={{
          1200: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1000: {
            slidesPerView: 4,
            spaceBetween: 20,
          },

          868: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          710: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          630: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          530: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          400: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          180: {
            slidesPerView: 1,
            spaceBetween: 70,
          },
        }}
      >
        {accommodations?.map((accommodation) => (
          <SwiperSlide key={accommodation._id}>
            <ChonCard accommodations={accommodation} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
