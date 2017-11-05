import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'

import flushImg from '../flush-img/flush-img.vue'

export default {
  'components': {
    'b-tag': bulma('tag', 'div'),
    flushImg
  },
  'computed': {
    favicon () {
      return `//${this.host}/favicon.ico`
    }
  },
  'props': {
    'host': {
      'type':    String,
      'default': ''
    }
  }
}
