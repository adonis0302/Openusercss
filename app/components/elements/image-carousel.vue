<script>
  import progressiveImage from '~/components/bits/progressive-image.vue'

  export default {
    'components': {
      progressiveImage,
    },

    'props': {
      'value': Array,
    },

    data () {
      return {
        'flickity': null,
        'items':    this.value.map((item) => this.proxyImage(item)),
      }
    },

    'watch': {
      value () {
        this.items = this.value.map((item) => this.proxyImage(item))
        this.$nextTick(this.rerender)
      },
    },

    'computed': {
      options () {
        return {
          'wrapAround':      true,
          'contain':         true,
          'fullscreen':      true,
          'cellAlign':       'center',
          'pageDots':        false,
          'prevNextButtons': false,
        }
      },
    },

    mounted () {
      this.Flickity = require('flickity')
      this.init()
    },

    beforeDestroy () {
      this.flickity.destroy()
      this.flickity = null
    },

    'methods': {
      init () {
        this.flickity = new this.Flickity(this.$refs.flickity, this.options)
        this.$emit('init', this.flickity)
      },

      resize () {
        this.flickity.resize()
      },

      reposition () {
        this.flickity.reposition()
      },

      rerender () {
        this.destroy()
        this.init()
      },

      destroy () {
        this.flickity.destroy()
        this.flickity = null
      },

      reloadCells () {
        this.flickity.reloadCells()
      },

      data () {
        return this.Flickity.data(this.$refs.flickity)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .carousel {
    transform: translateZ(0);

    &:not(.flickity-enabled) {
      height: 15rem;
      clip-path: polygon(0 0, 100% 0, 100% 15rem, 0 15rem);
    }
  }
</style>

<template lang="pug">
  .carousel(ref="flickity")
    progressive-image.carousel-cell(
      v-for="(image, index) in items",
      :key="image + index",
      :src="image.large",
      :placeholder="image.small",
      width="100%",
      height="15rem",
      size="cover",
      position="top left"
    )
</template>
