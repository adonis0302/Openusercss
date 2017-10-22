const {Image} = window

const updateImage = (self) => {
  const img = new Image()

  self.$el.classList.add('ouc-image-unloaded')
  self.src = self.placeholder
  img.src = self.source

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

  return true
}

export default {
  data () {
    return {
      'src': this.placeholder
    }
  },
  'props': {
    'source': {
      'type':    String,
      'default': '/img/main.bg-x640.png'
    },
    'placeholder': {
      'type':    String,
      'default': '/img/main.bg-x128.png'
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
  'methods': {
    onclick () {
      updateImage(this)
    }
  },
  'watch': {
    placeholder (newPlaceholder) {
      updateImage(this)
    }
  },
  mounted () {
    updateImage(this)
  }
}
