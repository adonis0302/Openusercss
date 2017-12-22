import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'

import spinner from '../../components/spinner/spinner.vue'
import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
import notification from '../../components/notification/notification.vue'

export default {
  'components': {
    'b-container': bulma('container', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    'b-tile':      bulma('tile', 'div'),
    'b-box':       bulma('box', 'div'),
    oucFooter,
    spinner,
    notification
  },
  'methods': {
    async resendVerification () {
      const {data} = await this.$store.dispatch('sendVerify', this.session.token)
      const {resendVerification} = data

      if (resendVerification) {
        this.$toast.success({
          'title':   'Sent',
          'message': 'Check your inbox!',
          'theme':   'ouc',
          'layout':  2
        })
      }
    }
  },
  'computed': mapGetters([
    'currentUser',
    'session',
    'actionErrors',
    'loading'
  ])
}
