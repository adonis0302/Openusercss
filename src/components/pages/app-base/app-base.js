import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import navbar from '../../components/navbar/navbar.vue'
import {LeftRight} from '../../../src/shared/animations'
import {mapGetters} from 'vuex'

export default {
  'components': {
    'b-box':         bulma('box', 'div'),
    'b-level':       bulma('level', 'div'),
    'b-level-left':  bulma('level-left', 'div'),
    'b-level-right': bulma('level-right', 'div'),
    'b-tag':         bulma('tag', 'div'),
    'b-container':   bulma('container', 'div'),
    navbar
  },
  beforeMount () {
    this.$store.dispatch('verifyToken')

    this.processInterval = setInterval(() => {
      this.process = process
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.processInterval)
  },
  'methods': new LeftRight(),
  data () {
    return {
      process
    }
  },
  'computed': mapGetters([
    'themes',
    'users',
    'session',
    'loading'
  ])
}
