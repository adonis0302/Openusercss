import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'

import attributor from '../../elements/footer/footer.vue'
import showcase from '../../sets/theme-showcase/theme-showcase.vue'
import navbar from '../../elements/navbar/navbar.vue'
import icon from '../../elements/icon/icon.vue'

import {leftRight} from '../../../../src/client/components/animations'

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
  'methods': {
    ...leftRight
  },
  'computed': {
    location () {
      return window.location
    }
  }
}
