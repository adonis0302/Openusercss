import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'

import attributor from '../../elements/footer/footer.vue'
import navbar from '../../elements/navbar/navbar.vue'
import showcase from '../../sets/theme-showcase/theme-showcase.vue'
import profile from '../../sets/profile/profile.vue'

import {leftRight} from '../../../src/client/components/animations'

export default {
  'components': {
    'b-container': bulma('container', 'div'),
    attributor,
    showcase,
    navbar,
    profile
  },
  'methods': {
    ...leftRight
  }
}
