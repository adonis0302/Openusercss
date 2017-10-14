import navbar from '../elements/navbar/navbar.vue'

export default {
  'components': {
    navbar
  },
  created () {
    this.$store.dispatch('getOfflineToken')
    this.$store.dispatch('verifyToken')
  }
}
