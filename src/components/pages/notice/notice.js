import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'

import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
import navbar from '../../components/navbar/navbar.vue'

export default {
  'components': {
    'b-container': bulma('container', 'div'),
    'b-content':   bulma('content', 'div'),
    'b-button':    bulma('button', 'div'),
    oucFooter,
    navbar,
  },
}
