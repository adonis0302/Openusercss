import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'

import attributor from '../../components/footer/footer.vue'
import showcase from '../../components/theme-showcase/theme-showcase.vue'
import navbar from '../../components/navbar/navbar.vue'
import icon from '../../components/icon/icon.vue'

export default {
  'components': {
    'b-section':   bulma('section', 'div'),
    'b-container': bulma('container', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    'b-box':       bulma('box', 'div'),
    attributor,
    showcase,
    navbar,
    icon
  },
  'computed': {
    location () {
      return window.location
    }
  }
}
