import attributor from '../../elements/footer/footer.vue'
import showcase from '../../sets/theme-showcase/theme-showcase.vue'
import navbar from '../../elements/navbar/navbar.vue'

import {
  leftToRight
} from '../../../src/client/components/animations'

export default {
  'components': {
    attributor,
    showcase,
    navbar
  },
  'methods': {
    ...leftToRight
  }
}
