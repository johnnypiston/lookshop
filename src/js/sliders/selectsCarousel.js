import Swiper from 'swiper';

const selectsCarousel = new Swiper('.selects__carousel', {
  width: 970,
  loop: true,
  slidesPerView: 'auto',
  centerInsufficientSlides: true,
  spaceBetween: 30,
  navigation: {
    nextEl: '.js-selects-next',
    prevEl: '.js-selects-prev',
  },
});

export default selectsCarousel;
