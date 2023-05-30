import { getDocument } from 'ssr-window';

import onTouchStart from './onTouchStart.js';
import onTouchMove from './onTouchMove.js';
import onTouchEnd from './onTouchEnd.js';
import onResize from './onResize.js';
import onClick from './onClick.js';
import onScroll from './onScroll.js';
import onLoad from './onLoad.js';

let dummyEventAttached = false;
function dummyEventListener() {}

const events = (swiper, method) => {
  const document = getDocument();
  const { params, el, wrapperEl, device } = swiper;
  const capture = !!params.nested;
  const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
  const elHasDomMethod = el && el[domMethod];
  const swiperMethod = method;

  // Touch Events
  if (elHasDomMethod) {
    el[domMethod]('pointerdown', swiper.onTouchStart, { passive: false });
  }
  document[domMethod]('pointermove', swiper.onTouchMove, { passive: false, capture });
  document[domMethod]('pointerup', swiper.onTouchEnd, { passive: true });
  document[domMethod]('pointercancel', swiper.onTouchEnd, { passive: true });
  document[domMethod]('pointerout', swiper.onTouchEnd, { passive: true });
  document[domMethod]('pointerleave', swiper.onTouchEnd, { passive: true });

  // Prevent Links Clicks
  if (elHasDomMethod && (params.preventClicks || params.preventClicksPropagation)) {
    el[domMethod]('click', swiper.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]('scroll', swiper.onScroll);
  }

  // Resize handler
  if (params.updateOnWindowResize) {
    swiper[swiperMethod](
      device.ios || device.android
        ? 'resize orientationchange observerUpdate'
        : 'resize observerUpdate',
      onResize,
      true,
    );
  } else {
    swiper[swiperMethod]('observerUpdate', onResize, true);
  }

  // Images loader
  if (elHasDomMethod) {
    el[domMethod]('load', swiper.onLoad, { capture: true });
  }
};

function attachEvents() {
  const swiper = this;
  const document = getDocument();
  const { params } = swiper;

  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);

  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }

  swiper.onClick = onClick.bind(swiper);
  swiper.onLoad = onLoad.bind(swiper);

  if (!dummyEventAttached) {
    document.addEventListener('touchstart', dummyEventListener);
    dummyEventAttached = true;
  }

  events(swiper, 'on');
}

function detachEvents() {
  const swiper = this;
  events(swiper, 'off');
}

export default {
  attachEvents,
  detachEvents,
};
