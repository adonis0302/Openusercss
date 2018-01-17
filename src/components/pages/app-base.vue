<script>
  import navbar from '../elements/navbar.vue'
  import {LeftRight,} from '../../shared/animations'
  import {mapGetters, mapMutations,} from 'vuex'

  export default {
    'components': {
      navbar,
    },
    beforeMount () {
      this.$store.dispatch('verifyToken')

      this.process = process
    },
    data () {
      return {
        process,
      }
    },
    'methods': {
      ...new LeftRight('easeOutCubic'),
      ...mapMutations([
        'clearCache',
      ]),
    },
    'computed': mapGetters([
      'session',
      'loading',
    ]),
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../client/scss/autocolor';
  @import '../../client/scss/variables';

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
  div
    navbar
    transition(
      @before-enter="beforeAppear",
      @enter="appear",
      @leave="none",
      :css="false"
    )
      router-view.ouc-app-root
</template>
