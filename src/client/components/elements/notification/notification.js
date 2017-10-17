import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import {leftRight} from '../../../src/client/components/animations'

export default {
  'components': {
    'b-notification': bulma('notification', 'div'),
    'b-tile':         bulma('tile', 'div'),
    icon
  },
  'methods': {
    ...leftRight
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
