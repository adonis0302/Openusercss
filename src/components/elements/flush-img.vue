<script>
  import spinner from './spinner.vue'

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
    self.isLoading = true
    const $images = self.$el.querySelectorAll('.ouc-flush-img-root > .img-container')

    unloaded($images)
    self.smallsrc = self.placeholder
    self.originalsrc = self.source

    try {
      await loadImage(self.smallsrc, Image)
      self.isLoading = false
      await loadImage(self.originalsrc, Image)
      loaded($images)
    } catch (error) {
      self.smallsrc = '/img/image-error-x128.png'
      self.originalsrc = '/img/image-error-x960.png'
      await loadImage(self.smallsrc, Image)
      self.isLoading = false
      await loadImage(self.originalsrc, Image)
      loaded($images)
    }

    return true
  }

  export default {
    'components': {
      spinner,
    },
    data () {
      return {
        'isLoading':   true,
        'smallsrc':    this.placeholder,
        'originalsrc': this.source,
      }
    },
    'props': {
      'source': {
        'type':    String,
        'default': '/img/main.bg-x640.png',
      },
      'placeholder': {
        'type':    String,
        'default': '/img/main.bg-x128.png',
      },
      'height': {
        'type':    String,
        'default': '200px',
      },
      'width': {
        'type':    String,
        'default': '100%',
      },
      'align': {
        'type':    String,
        'default': 'center',
      },
      'mode': {
        'type':    String,
        'default': 'cover',
      },
    },
    'watch': {
      placeholder (newPlaceholder) {
        updateImage(this, window.Image)
      },

      source (newSource) {
        updateImage(this, window.Image)
      },
    },
    mounted () {
      updateImage(this, window.Image)
    },
  }
</script>

<style lang="scss" scoped>
  @mixin img-transition {
    transition-property: filter, transform, opacity;
    transition-duration: .4s;
    transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
  }

  .img-container {
    background-repeat: no-repeat;
  }

  .ouc-flush-img-root {
    overflow: hidden;

    > .img-container {
      @include img-transition;
      height: 100%;
      width: 100%;
    }
  }

  .unloaded {
    &.ouc-flush-img-cover {
      filter: blur(5px);
      opacity: 1;
    }

    &.ouc-flush-img-real {
      opacity: 0;
    }
  }

  .loaded {
    &.ouc-flush-img-cover {
      filter: blur(5px);
      opacity: 0;
    }

    &.ouc-flush-img-real {
      opacity: 1;
    }
  }
</style>

<template lang="pug">
  div(:style="\
    'width: ' + width + ';\
    height: ' + height + ';'\
  ").ouc-flush-img-root
    spinner(
      v-if="loading",
      :spinning="loading",
      :size="30"
    )
    div(
      :style="\
        'background-image: url(' + smallsrc + ');\
        background-position: ' + align + ';\
        background-size: ' + mode + ';'\
    ").ouc-flush-img-cover.img-container
    div(
      :style="\
        'background-image: url(' + originalsrc + ');\
        background-position: ' + align + ';\
        background-size: ' + mode + ';\
        margin-top: -' + height + ';'\
    ").ouc-flush-img-real.img-container
</template>
