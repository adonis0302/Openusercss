import navbar from '../elements/navbar/navbar.vue'
import {leftRight} from '../../src/client/components/animations'

export default {
  'components': {
    navbar
  },
  created () {
    this.$store.dispatch('getOfflineToken')
    this.$store.dispatch('verifyToken')
  },
  'methods': {
    ...leftRight
  }
}
