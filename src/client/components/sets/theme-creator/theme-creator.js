import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'

import icon from '../../elements/icon/icon.vue'
import notification from '../../elements/notification/notification.vue'
import editor from '../../elements/editor/editor.vue'

export default {
  'components': {
    'b-columns':     bulma('columns', 'div'),
    'b-column':      bulma('column', 'div'),
    'b-box':         bulma('box', 'div'),
    'b-section':     bulma('section', 'div'),
    'b-container':   bulma('container', 'div'),
    'b-field':       bulma('field', 'div'),
    'b-label':       bulma('label', 'label'),
    'b-input':       bulma('input', 'input'),
    'b-textarea':    bulma('textarea', 'textarea'),
    'b-select':      bulma('select', 'select'),
    'b-control':     bulma('control', 'div'),
    'b-checkbox':    bulma('checkbox', 'checkbox'),
    'b-radio':       bulma('radio', 'radio'),
    'b-button':      bulma('button', 'button'),
    'b-help':        bulma('help', 'p'),
    'b-tile':        bulma('tile', 'div'),
    'b-level':       bulma('level', 'div'),
    'b-level-left':  bulma('level-left', 'div'),
    'b-level-right': bulma('level-right', 'div'),
    icon,
    notification,
    editor
  },
  'data': () => {
    return {
      'theme': {
        'title':       '',
        'description': '',
        'content':     ''
      },
      'code': ''
    }
  },
  'methods': {
    async submit () {
      const validated = await this.$validator.validateAll()

      if (validated) {
        this.$store.dispatch('updateFormData', this.theme)
        this.$store.dispatch('createTheme', this.theme)
      }
    }
  },
  'computed': {
    /* data () {
      return this.theme.content
    }, */
    ...mapGetters([
      'submitError'
    ])
  }
}
