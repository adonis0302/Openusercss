import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'

import attributor from '../../elements/footer/footer.vue'
import navbar from '../../elements/navbar/navbar.vue'
import showcase from '../../sets/theme-showcase/theme-showcase.vue'
import themeCreator from '../../sets/theme-creator/theme-creator.vue'

import {leftRight} from '../../../../src/components/animations'

export default {
  'components': {
    'b-section':   bulma('section', 'div'),
    'b-container': bulma('container', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    attributor,
    showcase,
    navbar,
    themeCreator
  },
  'methods': {
    ...leftRight
  }
}
