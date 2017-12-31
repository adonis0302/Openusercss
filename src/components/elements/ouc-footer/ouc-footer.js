import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'

export default {
  'components': {
    'b-footer':    bulma('footer', 'footer'),
    'b-container': bulma('container', 'div'),
    'b-content':   bulma('content', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    'b-tile':      bulma('tile', 'div'),
    'b-box':       bulma('box', 'div'),
    icon
  }
}
