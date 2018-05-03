<script>
  import progressiveImage from '~/components/bits/progressive-image.vue'

  export default {
    'name':  'nuxt-loading',
    'props': {
      'test': Boolean,
    },
    'components': {
      progressiveImage,
    },
    data () {
      return {
        'slow':       false,
        'loading':    false,
        'failed':     false,
        'slowTimer':  null,
        'tickTimer':  null,
        'countTimer': null,
        'counter':    0,
      }
    },
    'methods': {
      reset () {
        clearTimeout(this.slowTimer)
        clearTimeout(this.tickTimer)
        clearInterval(this.countTimer)

        this.slow = false
        this.loading = false
        this.failed = false
        this.counter = 0
      },
      start () {
        this.reset()
        this.loading = true

        let patience = 1500

        if (this.test) {
          patience = 650
        }

        this.slowTimer = setTimeout(() => {
          if (this.loading) {
            this.slow = true
          }
        }, patience)

        this.countTimer = setInterval(() => {
          this.counter = this.counter + 1
        }, 1000)
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
  @import '../../scss/component';

  $size: 400px;
  $v-gap: 50vh;
  $h-gap: 50vw;

  $leftborder: calc(#{$h-gap} - calc(#{$size} / 2));
  $rightborder: calc(#{$h-gap} + calc(#{$size} / 2));
  $topborder: calc(#{$v-gap} - calc(#{$size} / 2));
  $bottomborder: calc(#{$v-gap} + calc(#{$size} / 2));

  $topleft: $leftborder $topborder;
  $topright: $rightborder $topborder;
  $bottomleft: $leftborder $bottomborder;
  $bottomright: $rightborder $bottomborder;

  @keyframes Gradient {
  	0% {
  		background-position: 100% 50%
  	}
  	100% {
  		background-position: 0 50%
  	}
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .active-spin {
    transition: transform .3s ease-in-out;

    &:active {
      animation: spin .5s;
    }
  }

  .fill {
    height: 100%;
    width: 100%;
    left: 0;
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
    left: 0;
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

  .ouc-loading-cover {
    @include brand-gradient;

    transition-property: transform, opacity;
    transition-duration: .3s;
    transition-timing-function: ease-in-out;
    z-index: 151;
    position:relative;

    clip-path: polygon(
        0% 0%,
        0% 100%,
        $leftborder 100%,
        $topleft, /* Top left */
        $topright, /* Top right */
        $bottomright, /* Bottom right */
        $bottomleft, /* Bottom left */
        $leftborder 100%,
        100% 100%,
        100% 0%
    );

    opacity: 0;
    transform: scale(.9);

    @media (pointer: fine) and (max-width: 1367px) {
      transform:
        scale(4)
        rotate(45deg);
    }

    @media (pointer: fine) and (max-width: 1921px) and (min-width: 1367px) {
      transform:
        scale(4);
    }
  }

  .ouc-loading-inner {
    position: fixed;
    left: $leftborder;
    height: $size;
    width: $size;
    top: $topborder;
    background: nth(map-get($colors, 'background'), 1);
    color: nth(map-get($colors, 'background'), 2);
    z-index: 150;

    box-shadow: inset 0 0 70px -20px rgba(0, 0, 0, .7);

    transition-property: opacity, transform;
    transition-duration: .3s;
    transition-timing-function: ease-in-out;
    transition-delay: .2s;
    opacity: 0.0001;
    transform: scale(.9);

    background: repeating-linear-gradient(
      45deg,
      nth(map-get($colors, 'primary-dark'), 1),
      nth(map-get($colors, 'primary-dark'), 1) 10px,
      darken(nth(map-get($colors, 'primary-dark'), 1), 10) 10px,
      darken(nth(map-get($colors, 'primary-dark'), 1), 10) 20px
    );
    background-size: 400%;
    animation-name: Gradient;
    animation-duration: 45s;
    animation-timing-function: linear;
    animation-play-state: paused;
    animation-iteration-count: infinite;
  }

  .ouc-loading-root {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 150;
    pointer-events: none;
    user-select: none;

    &.show {
      pointer-events: all;

      > .ouc-loading-cover {
        opacity: 1;
        transform:
          scale(1)
          rotate(0deg);
      }

      > .ouc-loading-inner {
        opacity: 1;
        transform: scale(1);
        animation-play-state: running;
      }
    }
  }

  .is-fullwidth {
    width: 100%;
  }

  .is-inline {
    display: inline-flex;

    > * {
      display: inline-flex;
    }
  }

  .mh-1 {
    min-height: 3rem
  }
</style>

<template lang="pug">
  div
    .ouc-quick-loading(:class="{'show': !slow && loading}")
    .ouc-loading-root(:class="{'show': slow && loading}")
      .ouc-loading-cover.fill
        button.button.is-primary(v-if="test", @click="finish") Finish
      .ouc-loading-inner.is-hcentered.is-vcentered
        .tile.is-parent.is-vertical
          .tile.is-child
            progressive-image.active-spin(
              src="/img/openusercss.icon-x128.png",
              placeholder="/img/openusercss.icon-x16.png",
              width="128px",
              height="128px"
            )
          .tile.is-child.has-text-centered.mh-1
            br
            transition(name="push-right")
              .is-inline(v-if="counter < 3 || counter % 6 === 0")
                h4.is-bold(v-if="loading") Loading...
                h4.is-bold(v-else) Done!
            transition(name="push-left")
              .is-inline(v-if="counter >= 3 && counter % 6 !== 0")
                h4.is-bold {{counter}} seconds and counting
</template>
