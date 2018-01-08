import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'

import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
import spinner from '../../components/spinner/spinner.vue'
import flushImg from '../../components/flush-img/flush-img.vue'

export default {
  'components': {
    'b-container': bulma('container', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    oucFooter,
    spinner,
    flushImg,
  },
  data () {
    return {
      'spinning': true,
    }
  },
  'methods': {
    showInfo () {
      this.$toast.info({
        'title':   'Info',
        'message': 'This is an info message',
        'timeout': false,
        'theme':   'ouc',
        'layout':  2,
      })
    },
    showSuccess () {
      this.$toast.success({
        'title':   'Success',
        'message': 'This is a success message',
        'timeout': false,
        'theme':   'ouc',
        'layout':  2,
      })
    },
    showWarning () {
      this.$toast.warning({
        'title':   'Warning',
        'message': 'This is a warning message',
        'timeout': false,
        'theme':   'ouc',
        'layout':  2,
      })
    },
    showError () {
      this.$toast.error({
        'title':   'Error',
        'message': 'This is an error message',
        'timeout': false,
        'theme':   'ouc',
        'layout':  2,
      })
    },
  },
}
