<script>
  export default {
    'props': {
      'height': {
        'type': [
          Number,
          String,
        ],
        'default': '100%',
      },
      'width': {
        'type': [
          Number,
          String,
        ],
        'default': '100%',
      },
      'src':         String,
      'placeholder': String,
      'position':    {
        'type':    String,
        'default': 'top left',
      },
      'size': {
        'type':    String,
        'default': 'contain',
      },
      'raw': {
        'type':    Boolean,
        'default': false,
      },
      'circular': {
        'type':    Boolean,
        'default': false,
      },
    },
    'computed': {
      commonStyle () {
        return {
          'height': `${this.height}`,
          'width':  `${this.width}`,
        }
      },
    },
    data () {
      return {
        'style': {
          'height':              '100%',
          'width':               '100%',
          'background-image':    `url("${this.placeholder}")`,
          'background-repeat':   'no-repeat',
          'background-size':     this.size,
          'background-position': this.position,
          'transition':          'filter .3s ease-in-out',
          'filter':              'blur(4px)',
        },
        'rawStyle': {
          'height':     '100%',
          'width':      '100%',
          'transition': 'filter .3s ease-in-out',
          'filter':     'blur(4px)',
        },
      }
    },
    mounted () {
      const $image = document.createElement('img')

      $image.src = this.src
      $image.classList.add('is-invisible')

      $image.onload = () => {
        if (this.raw) {
          this.$refs.raw.src = this.src
          this.rawStyle.filter = ''
        } else {
          this.style['background-image'] = `url("${this.src}")`
          this.style.filter = ''
        }

        $image.remove()
      }

      if (this.raw) {
        this.$refs.raw.append($image)
      } else {
        this.$refs.main.appendChild($image)
      }
    },
  }
</script>

<template lang="pug">
  .ouc-responsive-image-wrapper(v-if="!raw", :style="commonStyle")
    .ouc-responsive-image(:style="style", ref="main", :class="{'is-circular': circular}")
      slot(name="overlay")
  img.ouc-responsive-image-raw(v-else, ref="raw", :style="rawStyle", :src="placeholder")
</template>
