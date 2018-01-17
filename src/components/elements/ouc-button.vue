<script>
  import {mapGetters,} from 'vuex'
  import icon from './icon.vue'

  export default {
    'components': {
      icon,
    },
    'computed': mapGetters([
      'loading',
    ]),
    'props': {
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
    icon(:icon="icon")
    slot(name="content")
</template>
