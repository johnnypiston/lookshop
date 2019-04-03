import Swiper from 'swiper';

const indexMainSlider = new Swiper('.js-main-slider', {
  loop: true,
  autoplay: {
    delay: 7000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: '.js-index-slider-next',
    prevEl: '.js-index-slider-prev',
  },
  pagination: {
    el: '.js-index-slider-pagination',
    type: 'bullets',
    bulletClass: 'main-slider__bullet',
    bulletActiveClass: 'main-slider__bullet--active',
    modifierClass: '',
    clickable: true,
  },
});

export default indexMainSlider;
