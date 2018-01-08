import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
import {mapGetters,} from 'vuex'

import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import icon from '../../components/icon/icon.vue'
import themeCard from '../../components/theme-card/theme-card.vue'

export default {
  'errorStatus': 404,
  'components':  {
    'b-container': bulma('container', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    'b-box':       bulma('box', 'div'),
    'b-tile':      bulma('tile', 'div'),
    oucFooter,
    navbar,
    icon,
    themeCard,
  },
  beforeMount () {
    this.$store.dispatch('getLatestThemes', 3)
  },
  'computed': {
    ...mapGetters([
      'actionErrors',
      'themes',
    ]),
  },
}
