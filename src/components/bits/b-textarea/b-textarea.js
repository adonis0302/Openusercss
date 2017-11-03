export default {
  'props': {
    'lazy': {
      'type':    Boolean,
      'default': false
    }
  },
  mounted () {
    if (this.lazy) {
      this.$el.onchange = () => {
        this.$emit('input', this.$el.value)
      }
    } else {
      this.$el.oninput = () => {
        this.$emit('input', this.$el.value)
      }
    }
  }
}
