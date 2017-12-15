import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'

import spinner from '../../components/spinner/spinner.vue'
import attributor from '../../components/footer/footer.vue'
import notification from '../../components/notification/notification.vue'

export default {
  'components': {
    'b-section':   bulma('section', 'div'),
    'b-container': bulma('container', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    'b-tile':      bulma('tile', 'div'),
    'b-box':       bulma('box', 'div'),
    'b-content':   bulma('content', 'div'),
    'b-button':    bulma('button', 'button'),
    attributor,
    spinner,
    notification
  },
  data () {
    return {
      'verifyResult': null
    }
  },
  'methods': {
    async resendVerification () {
      const {data} = await this.$store.dispatch('sendVerify', this.session.token)
      const {resendVerification} = data

      this.verifyResult = resendVerification
    }
  },
  'computed': mapGetters([
    'currentUser',
    'session',
    'actionErrors',
    'loading'
  ])
}
