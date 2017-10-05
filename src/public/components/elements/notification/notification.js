import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import {
  height
} from '../../../src/public/components/animations'

export default {
  'components': {
    'b-notification': bulma('notification', 'div'),
    'b-tile':         bulma('tile', 'div'),
    'b-level':        bulma('level', 'div'),
    'b-level-left':   bulma('level-left', 'div'),
    icon
  },
  'methods': {
    ...height('82px')
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
