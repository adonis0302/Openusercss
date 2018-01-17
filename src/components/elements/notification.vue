<script>
  import icon from './icon.vue'
  import {LeftRight,} from '../../../src/shared/animations'

  export default {
    'components': {
      icon,
    },
    'methods': new LeftRight(),
    'props':   {
      'icon': {
        'type':    String,
        'default': 'information',
      },
      'color': {
        'type':    String,
        'default': 'is-primary',
      },
    },
  }
</script>

<style lang="scss" scoped>
  .notification {
    padding: 32px;
  }

  .ouc-icon-wrapper {
    align-items: center;
    justify-content: center;
  }
</style>

<template lang="pug">
  transition(
    enter,
    v-on:before-enter="beforeAppear",
    v-on:enter="appear",
    v-on:before-leave="beforeLeave",
    v-on:leave="leave",
    v-bind:css="false"
  )
    .notification.ouc-notification(:class="color")
      .tile.is-ancestor
        .tile.is-1.ouc-icon-wrapper
          icon(:icon="icon")
        .tile
          slot(name="content")
</template>
