import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import {
  leftToRight
} from '../../../src/public/components/animations'

export default {
  'components': {
    'b-button':     bulma('button', 'button'),
    'b-tile':       bulma('tile', 'div'),
    'b-level':      bulma('level', 'div'),
    'b-level-left': bulma('level-left', 'div'),
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
