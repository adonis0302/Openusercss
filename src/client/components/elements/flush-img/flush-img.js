const {Image} = window

export default {
  data () {
    return {
      'src': this.placeholder
    }
  },
  'props': {
    'source': {
      'type':    String,
      'default': '/img/openusercss.icon-x360.png'
    },
    'placeholder': {
      'type':    String,
      'default': '/img/openusercss.icon-x16.png'
    },
    'height': {
      'type':    String,
      'default': '200'
    },
    'width': {
      'type':    String,
      'default': '100%'
    },
    'align': {
      'type':    String,
      'default': 'center'
    },
    'mode': {
      'type':    String,
      'default': 'cover'
    }
  },
  mounted () {
    const img = new Image()
    const self = this

    this.$el.classList.add('ouc-image-unloaded')

    img.src = this.source
    img.onload = () => {
      self.$el.classList.remove('ouc-image-unloaded')
      self.$el.classList.add('ouc-image-loaded')
      self.src = self.source
    }

    img.onerror = () => {
      self.$el.classList.remove('ouc-image-unloaded')
      self.$el.classList.add('ouc-image-error')
      self.src = '/img/image-error-x640.png'
    }
  }
}
