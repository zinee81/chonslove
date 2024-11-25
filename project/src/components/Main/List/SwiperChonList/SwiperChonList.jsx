import Styles from "./SwiperChonList.module.css";
import ChonCard from "./ChonCard/ChonCard.jsx";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import required modules
import { Navigation, Pagination } from "swiper/modules";

export default function SwiperChonList({ accommodations }) {
  console.log("전달할 숙소 데이터:", accommodations); // 데이터 확인용

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
