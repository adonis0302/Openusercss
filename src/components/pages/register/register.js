import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
import {mapGetters,} from 'vuex'

import flushImg from '../../components/flush-img/flush-img.vue'
import icon from '../../components/icon/icon.vue'
import notification from '../../components/notification/notification.vue'
import oucButton from '../../components/ouc-button/ouc-button.vue'
import bInput from '../../components/b-input/b-input.vue'

import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
import navbar from '../../components/navbar/navbar.vue'

export default {
  'components': {
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    'b-box':       bulma('box', 'div'),
    'b-container': bulma('container', 'div'),
    'b-field':     bulma('field', 'div'),
    'b-label':     bulma('label', 'label'),
    'b-textarea':  bulma('textarea', 'textarea'),
    'b-select':    bulma('select', 'select'),
    'b-control':   bulma('control', 'div'),
    'b-checkbox':  bulma('checkbox', 'checkbox'),
    'b-radio':     bulma('radio', 'radio'),
    'b-help':      bulma('help', 'p'),
    'b-tile':      bulma('tile', 'div'),
    oucButton,
    bInput,
    flushImg,
    icon,
    notification,
    oucFooter,
    navbar,
  },
  data () {
    return {
      'register': {
        'displayname':    '',
        'password':       '',
        'passwordVerify': '',
        'email':          '',
      },
    }
  },
  'computed': mapGetters([
    'actionErrors',
  ]),
  'methods': {
    async submitRegistration () {
      const validated = await this.$validator.validateAll()

      if (validated) {
        this.$store.dispatch('register', this.register)
      }
    },
  },
}
