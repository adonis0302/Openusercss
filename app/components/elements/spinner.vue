<script>
  export default {
    'props': [
      'size',
      'spinning',
      'speed',
    ],
    data () {
      return {
        'computedStyle': {
          'width':               this.sizePx(this.size),
          'height':              this.sizePx(this.size),
          'border-top-width':    this.sizePx(this.size / 2),
          'border-bottom-width': this.sizePx(this.size / 2),
        },
      }
    },
    created () {
      if (this.speed) {
        this.computedStyle['animation-duration'] = this.speed
      }
    },
    'methods': {
      sizePx (value) {
        if (typeof value === 'string') {
          return value
        }
        return `${value}px`
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../scss/component';

  @keyframes spin {
    0% {
      transform: rotate(0deg)
    }

    100% {
      transform: rotate(359deg)
    }
  }

  .spinner-root {
    align-items: center;
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .spinner {
    animation-name: spin;
    animation-duration: .65s;
    animation-play-state: paused;
    animation-iteration-count: infinite;
    border-top-style: solid;
    border-top-color: nth($primary, 1);
    border-bottom-style: solid;
    border-bottom-color: nth($primary, 2);
    border-radius: 50%;

    &.spinning {
      animation-play-state: running;
    }
  }
</style>

<template lang="pug">
  div.spinner-root.ouc-spinner-wrapper
    div.ouc-spinner(:style="computedStyle", :class="['spinner', {'spinning': spinning}]")
</template>
