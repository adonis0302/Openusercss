<script>
  export default {
    'props': {
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
  .notification.ouc-notification(:class="color")
    .tile.is-ancestor
      .tile.is-1.ouc-icon-wrapper
        fa-icon(:icon="icon")
      .tile
        slot(name="content")
</template>
