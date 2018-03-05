<script>
  export default {
    'props': {
      'loading': {
        'type':    Boolean,
        'default': false,
      },
      'icon': {
        'type':    String,
        'default': 'chevron-up',
      },
    },
  }
</script>

<style lang="scss" scoped>
  .button {
    height: 64px !important;
    width: 100%;
  }
</style>

<template lang="pug">
  button.button.ouc-button(:class="{'is-loading': loading}")
    fa-icon(:icon="icon")
    slot(name="content")
</template>
