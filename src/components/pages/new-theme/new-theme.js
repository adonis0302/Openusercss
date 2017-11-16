import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import noSSR from 'vue-no-ssr'
import {mapGetters} from 'vuex'

import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import showcase from '../../components/theme-showcase/theme-showcase.vue'
import icon from '../../components/icon/icon.vue'
import notification from '../../components/notification/notification.vue'
import editor from '../../components/editor/editor.vue'
import bInput from '../../components/b-input/b-input.vue'
import bTextarea from '../../components/b-textarea/b-textarea.vue'

const customDictionary = {
  'en': {
    'custom': {
      'content': {
        'required': 'Theme code must not be empty.'
      }
    }
  }
}

const getters = mapGetters([
  'user'
])

export default {
  'components': {
    'b-columns':     bulma('columns', 'div'),
    'b-column':      bulma('column', 'div'),
    'b-box':         bulma('box', 'div'),
    'b-section':     bulma('section', 'div'),
    'b-container':   bulma('container', 'div'),
    'b-field':       bulma('field', 'div'),
    'b-label':       bulma('label', 'label'),
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
    'no-ssr':        noSSR,
    attributor,
    showcase,
    navbar,
    icon,
    notification,
    editor,
    bInput,
    bTextarea
  },
  'data': () => {
    return {
      'theme': {
        'title':       '',
        'description': '',
        'scope':       '',
        'content':     ''
      },
      // eslint-disable-next-line
      'regex': /((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)/
    }
  },
  mounted () {
    this.$validator.updateDictionary(customDictionary)
  },
  'methods': {
    'user': getters.user,
    async submit () {
      const validated = await this.$validator.validateAll()

      if (validated) {
        this.$store.dispatch('createTheme', {
          'theme': {
            'title':       this.theme.title,
            'description': this.theme.description,
            'scope':       this.theme.scope,
            'content':     this.theme.content
          },
          'redirect': `/profile/${this.user()._id}`
        })
      }
    }
  },
  'computed': mapGetters([
    'actionErrors'
  ])
}
