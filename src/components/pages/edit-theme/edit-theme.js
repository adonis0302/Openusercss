import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import noSSR from 'vue-no-ssr'
import {mapGetters} from 'vuex'
import semver from 'semver'
import {cloneDeep, concat} from 'lodash'
import {Chrome as colorPicker} from 'vue-color'

import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
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
    'b-container':   bulma('container', 'div'),
    'b-field':       bulma('field', 'div'),
    'b-label':       bulma('label', 'label'),
    'b-select':      bulma('select', 'select'),
    'b-control':     bulma('control', 'div'),
    'b-checkbox':    bulma('checkbox', 'checkbox'),
    'b-radio':       bulma('radio', 'radio'),
    'b-help':        bulma('help', 'p'),
    'b-tile':        bulma('tile', 'div'),
    'b-level':       bulma('level', 'div'),
    'b-level-left':  bulma('level-left', 'div'),
    'b-level-right': bulma('level-right', 'div'),
    'no-ssr':        noSSR,
    oucFooter,
    navbar,
    icon,
    notification,
    editor,
    bInput,
    bTextarea,
    listCreator,
    colorPicker
  },
  'data': () => {
    return {
      // eslint-disable-next-line
      'regex': /((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)/,
      'editedTheme': {
        'title':       '',
        'description': '',
        'version':     '',
        'screenshots': [],
        'content':     '',
        'options':     []
      },
      'colors': {
        'hex': '#ffffff'
      }
    }
  },
  created () {
    const self = this

    if (!this.theme) {
      this.$store.dispatch('getFullTheme', this.$route.params.id)
      .then((theme) => {
        theme.user = {
          '_id': theme.user._id
        }
        self.editedTheme = theme
      })
    } else {
      self.editedTheme = this.$db.getCollection('themes').findOne({
        '_id': this.$route.params.id
      })
    }

    this.editedTheme.options.forEach((option, index) => {
      const cleanOption = cloneDeep(option)

      Reflect.deleteProperty(cleanOption, '__typename')
      this.editedTheme.options[index] = cleanOption
    })
  },
  beforeMount () {
    this.$validator.extend('semver', (value) => !!semver.valid(value))
    this.$validator.localize(customDictionary)
  },
  'methods': {
    concat,
    async submit () {
      const validated = await this.$validator.validateAll()

      if (validated) {
        const readyTheme = cloneDeep(this.theme)

        this.$store.dispatch('saveTheme', {
          'redirect': `/profile/${this.currentUser._id}`,
          readyTheme
        })
      }
    },
    addOption (type) {
      this.editedTheme.options.push({
        type
      })
    },
    removeOption (index) {
      this.editedTheme.options.splice(index, 1)
    },
    properCase (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    updateColor (colorObj, index) {
      this.editedTheme.options[index].default = colorObj.hex
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
