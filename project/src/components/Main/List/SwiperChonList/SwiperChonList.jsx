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

export default function SwiperChonList({ accommodations, isLoading }) {
  const skeletonArray = Array(4).fill(null);

  if (isLoading) {
    return (
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
        {skeletonArray.map((_, index) => (
          <SwiperSlide key={`skeleton-${index}`}>
            <CardSkeleton />
          </SwiperSlide>
        ))}
      </Swiper>
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
