import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import {
  leftToRight
} from '../../../src/public/components/animations'

export default {
  'components': {
    'b-notification': bulma('notification', 'div'),
    'b-tile':         bulma('tile', 'div'),
    icon
  },
  'methods': {
    ...leftToRight
  },
  'props': {
    'icon': {
      'type':    String,
      'default': 'information'
    },
    'color': {
      'type':    String,
      'default': 'is-primary'
    }
  }
}
