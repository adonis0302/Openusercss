import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'

import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'

export default {
  'components': {
    'b-section':   bulma('section', 'div'),
    'b-container': bulma('container', 'div'),
    attributor,
    navbar
  }
}
