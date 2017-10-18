import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'

import icon from '../icon/icon.vue'

export default {
  'components': {
    'b-field':   bulma('field', 'div'),
    'b-label':   bulma('label', 'label'),
    'b-input':   bulma('input', 'input'),
    'b-control': bulma('control', 'div'),
    icon
  }
}
