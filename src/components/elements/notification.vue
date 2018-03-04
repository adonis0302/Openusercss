<script>
  import {LeftRight,} from '../../../src/shared/animations'

  export default {
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
          fa-icon(:name="icon")
        .tile
          slot(name="content")
</template>
