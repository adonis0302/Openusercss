<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import {mapGetters,} from 'vuex'

  import icon from './icon.vue'

  export default {
    'components': {
      'b-button': bulma('button', 'button'),
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
  button {
    height: 64px !important;
    width: 100%;
  }
</style>

<template lang="pug">
  b-button(:class="['button', {'is-loading': loading}]")
    icon(:icon="icon")
    slot(name="content")
</template>
