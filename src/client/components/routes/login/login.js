import attributor from '../../elements/footer/footer.vue'
import navbar from '../../elements/navbar/navbar.vue'
import showcase from '../../sets/theme-showcase/theme-showcase.vue'
import loginForm from '../../sets/login-form/login-form.vue'

import {leftRight} from '../../../../src/client/components/animations'

export default {
  'components': {
    attributor,
    showcase,
    navbar,
    loginForm
  },
  'methods': {
    ...leftRight
  }
}
