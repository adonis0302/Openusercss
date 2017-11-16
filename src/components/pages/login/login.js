import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'

import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import showcase from '../../components/theme-showcase/theme-showcase.vue'

import icon from '../../components/icon/icon.vue'
import notification from '../../components/notification/notification.vue'
import button from '../../components/button/button.vue'
import bInput from '../../components/b-input/b-input.vue'

export default {
  'components': {
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    'b-box':       bulma('box', 'div'),
    'b-section':   bulma('section', 'div'),
    'b-container': bulma('container', 'div'),
    'b-field':     bulma('field', 'div'),
    'b-label':     bulma('label', 'label'),
    'b-textarea':  bulma('textarea', 'textarea'),
    'b-select':    bulma('select', 'select'),
    'b-control':   bulma('control', 'div'),
    'b-checkbox':  bulma('checkbox', 'checkbox'),
    'b-radio':     bulma('radio', 'radio'),
    'b-button':    bulma('button', 'button'),
    'b-help':      bulma('help', 'p'),
    'b-tile':      bulma('tile', 'div'),
    'big-button':  button,
    icon,
    notification,
    attributor,
    showcase,
    navbar,
    bInput
  },
  'data': () => {
    return {
      'login': {
        'email':    '',
        'password': ''
      }
    }
  },
  'methods': {
    async submitLogin () {
      const validated = await this.$validator.validateAll()

      if (validated) {
        this.$store.dispatch('login', this.login)
      }
    }
  },
  'computed': mapGetters([
    'actionErrors'
  ])
}
