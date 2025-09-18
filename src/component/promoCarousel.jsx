import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

function PromoCarousel() {
  return (
    <div className="w-full h-auto object-cover shadow-2xl shadow-orange-200">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      >
        <SwiperSlide>
          <img src="/offer1.png" alt="Offer 1" className="mx-auto rounded-lg shadow-lg w-full h-72" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/offer2.png" alt="Offer 2" className="mx-auto rounded-lg shadow-lg  w-full h-72" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/offer3.png" alt="Offer 3" className="mx-auto rounded-lg shadow-lg w-full h-72" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/offer4.png" alt="Offer 4" className="mx-auto rounded-lg shadow-lg  w-full h-72" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default PromoCarousel;
