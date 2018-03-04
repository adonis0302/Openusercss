<script>
  import navbar from '../components/elements/navbar.vue'

  export default {
    'components': {
      navbar,
    },
    beforeMount () {
      this.process = process
    },
    data () {
      return {
        process,
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../scss/autocolor';
  @import '../scss/variables';

  .ouc-app-root {
    background-color: $white;
    min-height: calc(100vh - #{map-get($kerning, 'navbar-height')});
    position: absolute;
    width: 100%;
  }

  .spacer {
    width: 1rem;
  }
</style>

<template lang="pug">
  div.ouc-app-root
    navbar
    nuxt
</template>
