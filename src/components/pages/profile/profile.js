import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'

import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import showcase from '../../components/theme-showcase/theme-showcase.vue'
import profile from '../../components/profile/profile.vue'

export default {
  'components': {
    'b-container': bulma('container', 'div'),
    attributor,
    showcase,
    navbar,
    profile
  }
}
