import Vue from 'vue'

Vue.mixin({
  'methods': {
    proxyImage (original) {
      if (!original) {
        return {
          'large': '/img/main.bg-x640.png',
          'small': '/img/main.bg-x128.png',
        }
      }

      return {
        'large': `https://imageproxy.openusercss.org/540x/${original}`,
        'small': `https://imageproxy.openusercss.org/50x/${original}`,
      }
    },
  },
})
