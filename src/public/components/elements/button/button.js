import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import {
  leftToRight
} from '../../../src/public/components/animations'

export default {
  'components': {
    'b-button': bulma('button', 'button'),
    icon
  },
  'methods': {
    ...leftToRight
  },
  'props': {
    'icon': {
      'type':    String,
      'default': 'chevron-up'
    }
  }
}
