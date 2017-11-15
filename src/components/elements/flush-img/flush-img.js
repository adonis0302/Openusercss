const loadImage = (url, Image) => {
  return new Promise((resolve, reject) => {
    if (process.browser) {
      const img = new Image()

      img.src = url
      img.onload = resolve
      img.onerror = reject
    } else {
      resolve()
    }
  })
}

const loaded = (elements) => {
  elements.forEach((element) => {
    element.classList.remove('unloaded')
    element.classList.add('loaded')
  })
}

const unloaded = (elements) => {
  elements.forEach((element) => {
    element.classList.remove('loaded')
    element.classList.add('unloaded')
  })
}

const updateImage = async (self, Image) => {
  const $images = self.$el.querySelectorAll('.ouc-flush-img-root > *')

  unloaded($images)
  self.smallsrc = self.placeholder
  self.originalsrc = self.source

  try {
    await loadImage(self.smallsrc, Image)
    await loadImage(self.originalsrc, Image)
    loaded($images)
  } catch (error) {
    self.smallsrc = '/img/image-error-x128.png'
    self.originalsrc = '/img/image-error-x960.png'
    await loadImage(self.smallsrc, Image)
    await loadImage(self.originalsrc, Image)
    loaded($images)
  }

  return true
}

export default {
  data () {
    return {
      'smallsrc':    this.placeholder,
      'originalsrc': this.source
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
      'default': '200px'
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
  'watch': {
    placeholder (newPlaceholder) {
      updateImage(this, window.Image)
    },

    source (newSource) {
      updateImage(this, window.Image)
    }
  },
  mounted () {
    updateImage(this, window.Image)
  }
}
