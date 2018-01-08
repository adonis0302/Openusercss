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
