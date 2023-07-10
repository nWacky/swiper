export default function setTransition(duration, byController) {
  const swiper = this;
  if (!swiper.params.cssMode) {
    if (swiper.wrapperEl && typeof swiper.wrapperEl !== 'string') {
      swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
    }
  }
  swiper.emit('setTransition', duration, byController);
}