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
      this.showing = true
      this.email = decode(this.encodedEmail)
    }, 2500)
  },
  data () {
    return {
      'showing':      false,
      'email':        '(please wait...)',
      'encodedEmail': '&#x6D;&#x6F;&#x63;&#x2E;&#x6D;&#x74;&#x6E;&#x65;&#x63;&#x65;&#x64;&#x40;&#x6D;&#x74;&#x6E;&#x65;&#x63;&#x65;&#x64;'
    }
  }
}
