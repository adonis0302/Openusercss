import attributor from '../../elements/footer/footer.vue'
import showcase from '../../sets/theme-showcase/theme-showcase.vue'
import navbar from '../../elements/navbar/navbar.vue'

import {leftRight} from '../../../../src/components/animations'

export default {
  'components': {
    attributor,
    showcase,
    navbar
  },
  'methods': {
    ...leftRight
  }
}
