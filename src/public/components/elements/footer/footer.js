import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import {
  leftToRight
} from '../../../src/public/components/animations'

export default {
  'components': {
    'b-footer':    bulma('footer', 'footer'),
    'b-container': bulma('container', 'div'),
    'b-content':   bulma('content', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    icon
  },
  'methods': {
    ...leftToRight
  }
}
