import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'
import {forOwn} from 'lodash'

import bSwitch from '../../components/b-switch/b-switch.vue'
import spinner from '../../components/spinner/spinner.vue'
import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
import notification from '../../components/notification/notification.vue'
import oucButton from '../../components/ouc-button/ouc-button.vue'
import bInput from '../../components/b-input/b-input.vue'
import bTextarea from '../../components/b-textarea/b-textarea.vue'
import icon from '../../components/icon/icon.vue'

export default {
  'components': {
    'b-container':   bulma('container', 'div'),
    'b-columns':     bulma('columns', 'div'),
    'b-column':      bulma('column', 'div'),
    'b-tile':        bulma('tile', 'div'),
    'b-box':         bulma('box', 'div'),
    'b-level':       bulma('level', 'div'),
    'b-level-left':  bulma('level-left', 'div'),
    'b-level-right': bulma('level-right', 'div'),
    'b-control':     bulma('control', 'div'),
    oucFooter,
    spinner,
    notification,
    bInput,
    oucButton,
    bTextarea,
    bSwitch,
    icon
  },
  data () {
    return {
      'email':   '',
      'account': {
        'email':       '',
        'password':    '',
        'displayname': '',
        'bio':         ''
      },
      'editing': {
        'email':       null,
        'password':    null,
        'displayname': null,
        'bio':         null
      }
    }
  },
  async beforeMount () {
    if (this.session.user) {
      const user = await this.$store.dispatch('getFullUser', this.session.user._id)

      this.account.bio = user.bio
    }
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
    },
    async submitAccount () {
      const self = this

      forOwn(this.editing, (value, key) => {
        if (value) {
          this.$store.dispatch('account', {
            'accountData': {
              [key]: self.account[key]
            },
            'redirect': `/profile/${this.currentUser._id}`
          })
        }
      })
    }
  },
  'computed': {
    ...mapGetters([
      'currentUser',
      'session',
      'actionErrors',
      'loading'
    ]),
    editingCount () {
      let result = 0

      forOwn(this.editing, (value, key) => {
        if (value) {
          result = result + 1
        }
      })

      return result
    }
  }
}
