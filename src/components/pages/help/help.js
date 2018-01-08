import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'

import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import icon from '../../components/icon/icon.vue'
import notification from '../../components/notification/notification.vue'

export default {
  'components': {
    'b-container': bulma('container', 'div'),
    'b-content':   bulma('content', 'div'),
    'b-button':    bulma('button', 'div'),
    'b-box':       bulma('box', 'div'),
    oucFooter,
    navbar,
    icon,
    notification,
  },
  'computed': {
    extension () {
      return process.extension
    },
  },
}
