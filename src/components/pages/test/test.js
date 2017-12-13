import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import attributor from '../../components/footer/footer.vue'

import spinner from '../../components/spinner/spinner.vue'
import flushImg from '../../components/flush-img/flush-img.vue'

export default {
  'components': {
    'b-section':   bulma('section', 'div'),
    'b-container': bulma('container', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    attributor,
    spinner,
    flushImg
  },
  data () {
    return {
      'spinning': true
    }
  }
}
