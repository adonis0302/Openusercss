import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import noSSR from 'vue-no-ssr'
import {mapGetters} from 'vuex'
import semver from 'semver'
import {cloneDeep, concat} from 'lodash'

import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import icon from '../../components/icon/icon.vue'
import notification from '../../components/notification/notification.vue'
import editor from '../../components/editor/editor.vue'
import bInput from '../../components/b-input/b-input.vue'
import bTextarea from '../../components/b-textarea/b-textarea.vue'
import listCreator from '../../components/list-creator/list-creator.vue'

const customDictionary = {
  'en': {
    'custom': {
      'content': {
        'required': 'Theme code must not be empty'
      },
      'version': {
        'semver': 'Theme versioning must be semantic'
      }
    }
  }
}

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
    navbar,
    icon,
    notification,
    editor,
    bInput,
    bTextarea,
    listCreator
  },
  'data': () => {
    return {
      // eslint-disable-next-line
      'regex': /((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)/
    }
  },
  beforeMount () {
    this.$validator.extend('semver', (value) => !!semver.valid(value))
    this.$validator.updateDictionary(customDictionary)
  },
  'methods': {
    concat,
    async submit () {
      const validated = await this.$validator.validateAll()

      if (validated) {
        this.$store.dispatch('saveTheme', {
          'readyTheme': cloneDeep(this.theme),
          'redirect':   `/profile/${this.currentUser._id}`
        })
      }
    }
  },
  'computed': {
    ...mapGetters([
      'actionErrors',
      'currentUser',
      'loading'
    ]),
    theme () {
      if (!this.$route.params.id) {
        return {}
      }

      return this.$db.getCollection('themes').findOne({
        '_id': this.$route.params.id
      })
    }
  }
}
