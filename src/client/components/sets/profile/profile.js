import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'

import profileCard from '../../elements/profile-card/profile-card.vue'
import themeCard from '../../elements/theme-card/theme-card.vue'
import flushImg from '../../elements/flush-img/flush-img.vue'

import {leftRight} from '../../../src/client/components/animations'

export default {
  'components': {
    'b-columns':     bulma('columns', 'div'),
    'b-column':      bulma('column', 'div'),
    'b-section':     bulma('section', 'div'),
    'b-box':         bulma('box', 'div'),
    'b-button':      bulma('button', 'button'),
    'b-level':       bulma('level', 'div'),
    'b-level-left':  bulma('level-left', 'div'),
    'b-level-right': bulma('level-right', 'div'),
    profileCard,
    themeCard,
    flushImg
  },
  created () {
    this.$store.dispatch('getThemes')
  },
  'methods': {
    ...leftRight,
    ...mapGetters([
      'user'
    ])
  }
}
