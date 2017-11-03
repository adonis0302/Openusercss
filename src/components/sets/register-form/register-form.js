import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'

import themeCard from '../../components/theme-card/theme-card.vue'
import flushImg from '../../components/flush-img/flush-img.vue'
import icon from '../../components/icon/icon.vue'
import notification from '../../components/notification/notification.vue'
import button from '../../components/button/button.vue'

// eslint-disable-next-line
console.warn('You\'re still using this component, which is deprecated (in-sets)')

export default {
  'components': {
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    'b-box':       bulma('box', 'div'),
    'b-section':   bulma('section', 'div'),
    'b-container': bulma('container', 'div'),
    'b-field':     bulma('field', 'div'),
    'b-label':     bulma('label', 'label'),
    'b-input':     bulma('input', 'input'),
    'b-textarea':  bulma('textarea', 'textarea'),
    'b-select':    bulma('select', 'select'),
    'b-control':   bulma('control', 'div'),
    'b-checkbox':  bulma('checkbox', 'checkbox'),
    'b-radio':     bulma('radio', 'radio'),
    'b-button':    bulma('button', 'button'),
    'b-help':      bulma('help', 'p'),
    'b-tile':      bulma('tile', 'div'),
    'big-button':  button,
    themeCard,
    flushImg,
    icon,
    notification
  },
  data () {
    return {
      'register': {
        'displayname': '',
        'password':    '',
        'email':       ''
      }
    }
  },
  'computed': mapGetters([
    'actionErrors'
  ]),
  'methods': {
    async submitRegistration () {
      const validated = await this.$validator.validateAll()

      if (validated) {
        this.$store.dispatch('updateFormData', this.register)
        this.$store.dispatch('register', this.register)
      }
    }
  }
}
