import attributor from '../../elements/footer/footer.vue'
import showcase from '../../sets/theme-showcase/theme-showcase.vue'
import navbar from '../../elements/navbar/navbar.vue'
import registerForm from '../../sets/register-form/register-form.vue'

import {leftRight} from '../../../../src/client/components/animations'

export default {
  'components': {
    attributor,
    showcase,
    navbar,
    registerForm
  },
  'methods': {
    ...leftRight
  }
}
