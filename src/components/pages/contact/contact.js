import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {decode} from 'he'

import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'

export default {
  'components': {
    'b-section':   bulma('section', 'div'),
    'b-container': bulma('container', 'div'),
    'b-content':   bulma('content', 'div'),
    'b-button':    bulma('button', 'div'),
    attributor,
    navbar
  },
  mounted () {
    setTimeout(() => {
      this.email = decode(this.encodedEmail)
    }, 2500)
  },
  data () {
    return {
      'email':        '(please wait...)',
      'encodedEmail': '&#x64;&#x65;&#x63;&#x65;&#x6E;&#x74;&#x6D;&#x40;&#x64;&#x65;&#x63;&#x65;&#x6E;&#x74;&#x6D;&#x2E;&#x63;&#x6F;&#x6D;'
    }
  }
}
