const {Image} = window

const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.src = url
    img.onload = resolve
    img.onerror = reject
  })
}

const updateImage = async (self) => {
  self.$el.classList.add('ouc-image-unloaded')

  const placeholderLoaded = preloadImage(self.placeholder)
  const sourceLoaded = preloadImage(self.source)

  try {
    await placeholderLoaded
    self.src = self.placeholder

    await sourceLoaded
    self.src = self.source

    self.$el.classList.remove('ouc-image-unloaded')
    self.$el.classList.add('ouc-image-loaded')
  } catch (error) {
    const errorPlaceholderLoaded = preloadImage('/img/image-error-x128.png')
    const errorSourceLoaded = preloadImage('/img/image-error-x960.png')

    await errorPlaceholderLoaded
    self.src = '/img/image-error-x128.png'

    await errorSourceLoaded
    self.src = '/img/image-error-x960.png'

    self.$el.classList.remove('ouc-image-unloaded')
    self.$el.classList.add('ouc-image-errored')
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
