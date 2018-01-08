import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
import {decode,} from 'he'

import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
import navbar from '../../components/navbar/navbar.vue'

export default {
  'components': {
    'b-container': bulma('container', 'div'),
    'b-content':   bulma('content', 'div'),
    'b-button':    bulma('button', 'div'),
    oucFooter,
    navbar,
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
      'encodedEmail': '&#x67;&#x72;&#x6F;&#x2E;&#x73;&#x73;&#x63;&#x72;&#x65;&#x73;&#x75;&#x6E;&#x65;&#x70;&#x6F;&#x40;&#x6D;&#x74;&#x6E;&#x65;&#x63;&#x65;&#x64;',
    }
  },
}
