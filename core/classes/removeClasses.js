export default function removeClasses() {
  const swiper = this;
  const {
    el,
    classNames
  } = swiper;
  if (el && el.classList) {
    el.classList.remove(...classNames);
  }
  swiper.emitContainerClasses();
}