import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
// import fontAwesomeIcon from '@fortawesome/vue-fontawesome'
import icon from '../icon/icon.vue'

export default {
  'components': {
    'b-footer':    bulma('footer', 'footer'),
    'b-container': bulma('container', 'div'),
    'b-content':   bulma('content', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    icon
  }
}
