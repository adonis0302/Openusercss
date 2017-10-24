import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import {LeftRight} from '../../../../src/components/animations'

export default {
  'components': {
    'b-notification': bulma('notification', 'div'),
    'b-tile':         bulma('tile', 'div'),
    icon
  },
  'methods': new LeftRight(),
  'props':   {
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
