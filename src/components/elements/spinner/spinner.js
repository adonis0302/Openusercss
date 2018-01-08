export default {
  'props': [
    'size',
    'spinning',
  ],
  data () {
    return {
      'computedStyle': {
        'width':               this.sizePx(this.size),
        'height':              this.sizePx(this.size),
        'border-top-width':    this.sizePx(this.size / 2),
        'border-bottom-width': this.sizePx(this.size / 2),
      },
    }
  },
  'methods': {
    sizePx (value) {
      if (typeof value === 'string') {
        return value
      }
      return `${value}px`
    },
  },
}
