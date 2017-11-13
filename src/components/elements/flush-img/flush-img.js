const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    if (process.BROWSER_BUILD) {
      const {Image} = window
      const img = new Image()

      img.src = url
      img.onload = resolve(img)
      img.onerror = () => {
        throw new Error('Image loading failed')
      }
    } else {
      resolve()
    }
  })
}

const loaded = (element) => {
  element.classList.remove('unloaded')
  element.classList.add('loaded')
}

const updateImage = async (self, Image) => {
  const $cover = self.$el.querySelector('.ouc-flush-img-cover')
  const $real = self.$el.querySelector('.ouc-flush-img-real')

  await loadImage(self.smallsrc)

  try {
    await loadImage(self.originalsrc)
    loaded($real)
    loaded($cover)
  } catch (error) {
    await loadImage('/img/image-error-x128.png')
    self.src = '/img/image-error-x128.png'

    await loadImage('/img/image-error-x960.png')
    self.src = '/img/image-error-x960.png'

    loaded($real)
    loaded($cover)
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
  'watch': {
    placeholder (newPlaceholder) {
      if (window) {
        updateImage(this, window.Image)
      }
    }
  },
  mounted () {
    if (window) {
      updateImage(this, window.Image)
    }
  }
}
