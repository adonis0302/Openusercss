import Vue from 'vue'

Vue.component('ouc-noscript', {
  data () {
    return {
      'canRender': !!process.server,
    }
  },
  render (h) {
    if (this.canRender) {
      if (
        process.env.NODE_ENV === 'development'
        && this.$slots.default
        && this.$slots.default.length > 1
      ) {
        throw new Error('[vue-noscript] You cannot use multiple child components')
      }
      return this.$slots.default && this.$slots.default[0]
    }

    return h(
      'noscript', {
        'class': [
          'vue-noscript-placeholder',
        ],
      },
      this.$slots.placeholder || this.placeholder
    )
  },
})
