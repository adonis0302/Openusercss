import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'

import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import showcase from '../../components/theme-showcase/theme-showcase.vue'
import themeCreator from '../../components/theme-creator/theme-creator.vue'

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
  }
}
