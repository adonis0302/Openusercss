<template lang="pug">
  div
    .ouc-quick-loading(:class="{'show': !slow && loading}")
    .ouc-loading-root(:class="{'show': slow && loading}")
      .ouc-loading-cover
      .ouc-loading-cover
      .ouc-loading-message-wrapper
        .ouc-loading-icon
        .ouc-progress-wrapper
          .ouc-progress-indicator(v-if="percent !== 0", :style="{width: percent + '%'}")
        .ouc-loading-message(v-if="percent <= 100")
          h1 {{percent}}%
          h5 Looks like the network is slow. Please wait...
        .ouc-loading-message(v-if="percent > 100")
          h1 {{percent}}%
          h5
            | I'm sorry, I don't actually know the progress. Let's see how high
            | we can count!
            br
            | I'll let you know when it's complete, or if I run
            | into an error.
</template>

<script>
  export default {
    'name': 'nuxt-loading',
    data () {
      return {
        'slow':    false,
        'loading': false,
        'failed':  false,
        'percent': 0,
        'timer':   null,
      }
    },
    'methods': {
      reset () {
        if (this.timer) {
          clearInterval(this.timer)
        }

        this.slow = false
        this.loading = false
        this.failed = false
        this.percent = 0
      },
      start () {
        this.reset()
        this.loading = true

        this.timer = setInterval(() => {
          setTimeout(() => {
            if (this.loading) {
              this.increase(Math.floor(Math.random() * 5))
            }
          }, Math.random() * 400)
        }, 400)

        setTimeout(() => {
          if (this.loading) {
            this.slow = true
          }
        }, 2000)
      },
      finish () {
        this.reset()
      },
      fail () {
        this.reset()
        this.failed = true
      },
      increase (num) {
        this.percent = this.percent + Math.floor(num)
        return this
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../scss/autocolor';
  @import '../../scss/variables';

  @keyframes Gradient {
  	0% {
  		background-position: 100% 50%
  	}
  	100% {
  		background-position: 0 50%
  	}
  }

  .ouc-quick-loading {
    background: repeating-linear-gradient(
      45deg,
      nth(map-get($colors, 'secondary'), 1),
      nth(map-get($colors, 'secondary'), 1) 10px,
      darken(nth(map-get($colors, 'secondary'), 1), 10) 10px,
      darken(nth(map-get($colors, 'secondary'), 1), 10) 20px
    );
    background-size: 400%;
    animation-name: Gradient;
    animation-duration: 45s;
    animation-timing-function: linear;
    animation-play-state: running;
    animation-iteration-count: infinite;
    position: fixed;
    width: 100%;
    transition-property: height;
    transition-timing-function: map-get($animations, 'animation-function');
    transition-duration: map-get($animations, 'shorttime');
    top: map-get($kerning, 'navbar-height');
    height: 0;
    display: flex;
    z-index: 101;
    pointer-events: none;

    &.show {
      height: 7.5px;
    }
  }

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
