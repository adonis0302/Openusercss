<template lang="pug">
  .ouc-loading-root(:class="{'show': loading && slow}")
    .ouc-loading-cover
    .ouc-loading-cover
    .ouc-loading-message-wrapper
      .ouc-loading-icon
      .ouc-progress-wrapper
        .ouc-progress-indicator(v-if="progress !== 0", :style="{width: progress + '%'}")
      .ouc-loading-message(v-if="progress !== 0")
        h1 {{progress}}%
        h5 Looks like the network is slow. Please wait...
      .ouc-loading-message(v-if="progress === 0")
        h3 Looks like the network is slow. Please wait...
</template>

<script>
  export default {
    'data': () => ({
      'slow':     false,
      'loading':  false,
      'failed':   false,
      'progress': 0,
    }),
    'methods': {
      reset () {
        this.slow = false
        this.loading = false
        this.failed = false
        this.progress = 0
      },
      increase (num) {
        this.progress = num
      },
      start () {
        this.reset()
        this.loading = true

        setTimeout(() => {
          if (this.loading) {
            this.slow = true
          }
        }, 1000)
      },
      finish () {
        this.reset()
      },
      fail () {
        this.reset()
        this.failed = true
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../scss/autocolor';
  @import '../../scss/variables';

  .ouc-loading-root {
    position: fixed;
    z-index: 998;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    pointer-events: none;
  }

  .ouc-loading-cover {
    position: fixed;
    z-index: 999;
    left: 0;
    height: 50%;
    width: 100%;
    background-color: nth($primary, 1);
    color: nth($primary, 2);
    pointer-events: all;
    cursor: progress;
    transform:
      rotateZ(5deg)
      scale(1.5);
    transition-property:
      top,
      bottom,
      transform;
    transition-duration: map-get($animations, 'longtime');
    transition-timing-function: map-get($animations, 'animation-function');
  }

  .ouc-progress-wrapper {
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 80vw;
    height: 3px;
    background-color: nth(map-get($colors, 'background'), 1);
    display: flex;
    align-items: flex-start;
    flex-direction: row;

    .ouc-progress-indicator {
      transition-property: width;
      transition-duration: map-get($animations, 'shorttime');
      transition-timing-function: map-get($animations, 'animation-function');
      height: 3px;
      background-color: nth(map-get($colors, 'secondary'), 1);
    }
  }

  .ouc-loading-message-wrapper {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-flow: column;
    flex-direction: column;
    z-index: 1000;

    .ouc-loading-icon {
      background-image: url('~/static/img/openusercss.icon.svg');
      background-repeat: no-repeat;
      background-position: top center;
      background-size: contain;

      display: flex;
      height: 5rem;
      width: 5rem;
    }

    .ouc-loading-message {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: nth($primary, 2);
    }
  }

  .ouc-loading-root {
    .ouc-loading-cover:nth-child(1) {
      bottom: 130%;
    }

    .ouc-loading-cover:nth-child(2) {
      top: 130%;
    }

    .ouc-loading-message-wrapper {
      transition-property: opacity, transform;
      transition-duration: map-get($animations, 'shorttime');
      transition-timing-function: map-get($animations, 'animation-function');
      opacity: 0;
      transform: scale(.9);
      pointer-events: none;
    }

    &.show {
      .ouc-loading-cover {
        transform:
          rotateZ(0)
          scale(1);
      }

      .ouc-loading-cover:nth-child(1) {
        bottom: 50%;
      }

      .ouc-loading-cover:nth-child(2) {
        top: 50%;
      }

      .ouc-loading-message-wrapper {
        opacity: 1;
        transform: scale(1);
      }
    }
  }
</style>
