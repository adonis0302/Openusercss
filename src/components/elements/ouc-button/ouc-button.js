import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'

import icon from '../icon/icon.vue'

export default {
  'components': {
    'b-button': bulma('button', 'button'),
    icon
  },
  'computed': mapGetters([
    'loading'
  ]),
  'props': {
    'icon': {
      'type':    String,
      'default': 'chevron-up'
    }
  }
}
