import navbar from '../../components/navbar/navbar.vue'
import {LeftRight} from '../../../shared/animations'

export default {
  'components': {
    navbar
  },
  created () {
    this.$store.dispatch('getOfflineToken')
    this.$store.dispatch('verifyToken')
  },
  'methods': new LeftRight()
}
