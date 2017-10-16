import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'

import attributor from '../../elements/footer/footer.vue'
import showcase from '../../sets/theme-showcase/theme-showcase.vue'
import navbar from '../../elements/navbar/navbar.vue'

import {leftToRight} from '../../../src/client/components/animations'

export default {
  'components': {
    'b-container': bulma('container', 'div'),
    attributor,
    showcase,
    navbar
  },
  'methods': {
    ...leftToRight
  }
}
