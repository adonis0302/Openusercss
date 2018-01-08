<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import navbar from '../../components/navbar/navbar.vue'
  import {LeftRight,} from '../../../src/shared/animations'
  import {mapGetters, mapMutations,} from 'vuex'

  export default {
    'components': {
      'b-box':         bulma('box', 'div'),
      'b-level':       bulma('level', 'div'),
      'b-level-left':  bulma('level-left', 'div'),
      'b-level-right': bulma('level-right', 'div'),
      'b-tag':         bulma('tag', 'div'),
      'b-container':   bulma('container', 'div'),
      'b-columns':     bulma('columns', 'div'),
      'b-column':      bulma('column', 'div'),
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
  @import '../../../client/scss/autocolor';
  @import '../../../client/scss/variables';

  @import 'node_modules/bulma/sass/utilities/all';
  @import 'node_modules/bulma/sass/base/all';

  @import 'node_modules/bulma/sass/grid/columns';
  @import 'node_modules/bulma/sass/elements/box';
  @import 'node_modules/bulma/sass/elements/tag';
  @import 'node_modules/bulma/sass/elements/container';
  @import 'node_modules/bulma/sass/elements/button';
  @import 'node_modules/bulma/sass/components/level';

  .ouc-app-root {
    background-color: $white;
    min-height: calc(100vh - #{map-get($kerning, 'navbar-height')});
    position: absolute;
    width: 100%;
  }

  .spacer {
    width: 1rem;
  }

  @import '../../../client/scss/reboot';
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
