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
        },
        'rawStyle': {
          'height': '100%',
          'width':  '100%',
        },
      }
    },
    mounted () {
      const $image = document.createElement('img')

      $image.src = this.src
      $image.classList.add('is-invisible')

      $image.addEventListener('load', () => {
        if (this.raw) {
          this.$refs.raw.src = this.src
          this.$refs.raw.classList.remove('is-loading')
        } else {
          this.style['background-image'] = `url("${this.src}")`

          if (this.$refs.mainWrapper) {
            this.$refs.mainWrapper.classList.remove('is-loading')
          }
        }

        $image.remove()
      })

      const srcClass = this.src.replace(/(https?\:\/\/imageproxy\.openusercss\.org\/|https?\:\/\/|\.|\/|\:)/g, '-')

      if (this.raw) {
        this.$refs.raw.append($image)
        this.$refs.raw.classList.add(srcClass)
      } else {
        this.$refs.main.appendChild($image)
        this.$refs.main.classList.add(srcClass)
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../scss/component';

  @keyframes loading {
    0%,
    80%,
    100% {
      transform: scale(1);
      opacity: 1;
      filter: grayscale(0) blur(4px);
    }

    40% {
      transform: scale(.93);
      opacity: .75;
      filter: grayscale(20%) blur(6px);
    }
  }

  .ouc-responsive-image-wrapper,
  .ouc-responsive-image-raw {
    transition:
      filter .3s ease-out;
    margin: 0 auto;
  }

  .is-loading {
    filter: blur(4px);

    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NCIgaGVpZ2h0PSI0NCIgc3Ryb2tlPSIjZmZmIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS13aWR0aD0iMiI+PGNpcmNsZSBjeD0iMjIiIGN5PSIyMiIgcj0iMSI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgYmVnaW49IjBzIiBjYWxjTW9kZT0ic3BsaW5lIiBkdXI9IjEuOHMiIGtleVNwbGluZXM9IjAuMTY1LCAwLjg0LCAwLjQ0LCAxIiBrZXlUaW1lcz0iMDsgMSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTsgMjAiLz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utb3BhY2l0eSIgYmVnaW49IjBzIiBjYWxjTW9kZT0ic3BsaW5lIiBkdXI9IjEuOHMiIGtleVNwbGluZXM9IjAuMywgMC42MSwgMC4zNTUsIDEiIGtleVRpbWVzPSIwOyAxIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOyAwIi8+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMjIiIGN5PSIyMiIgcj0iMSI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgYmVnaW49Ii0wLjlzIiBjYWxjTW9kZT0ic3BsaW5lIiBkdXI9IjEuOHMiIGtleVNwbGluZXM9IjAuMTY1LCAwLjg0LCAwLjQ0LCAxIiBrZXlUaW1lcz0iMDsgMSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTsgMjAiLz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utb3BhY2l0eSIgYmVnaW49Ii0wLjlzIiBjYWxjTW9kZT0ic3BsaW5lIiBkdXI9IjEuOHMiIGtleVNwbGluZXM9IjAuMywgMC42MSwgMC4zNTUsIDEiIGtleVRpbWVzPSIwOyAxIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOyAwIi8+PC9jaXJjbGU+PC9nPjwvc3ZnPg==);
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>

<template lang="pug">
  img.ouc-responsive-image-raw.is-loading(v-if="raw", ref="raw", :style="rawStyle", :src="placeholder")
  .ouc-responsive-image-wrapper.is-loading(v-else, ref="mainWrapper", :style="commonStyle", :class="{'is-circular': circular}")
    .ouc-responsive-image(:style="style", ref="main", :class="{'is-circular': circular}")
      slot(name="overlay")
</template>
