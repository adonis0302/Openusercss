import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'

import icon from '../icon/icon.vue'
import {LeftRight} from '../../../src/shared/animations'

export default {
  'components': {
    'b-button': bulma('button', 'button'),
    icon
  },
  'methods':  new LeftRight(),
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
