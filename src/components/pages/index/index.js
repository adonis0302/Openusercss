import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'

import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import searchField from '../../components/search-field/search-field.vue'
import chip from '../../components/chip/chip.vue'
import themeCard from '../../components/theme-card/theme-card.vue'
import flushImg from '../../components/flush-img/flush-img.vue'
import notification from '../../components/notification/notification.vue'

export default {
  'components': {
    'b-tile':      bulma('tile', 'div'),
    'b-container': bulma('container', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    'b-box':       bulma('box', 'div'),
    searchField,
    oucFooter,
    themeCard,
    flushImg,
    navbar,
    chip,
    notification
  },
  beforeMount () {
    this.$store.dispatch('getLatestThemes', 6)
  },
  'computed': {
    ...mapGetters([
      'actionErrors',
      'themes'
    ])
  }
}
