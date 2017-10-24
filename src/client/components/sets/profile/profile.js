import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'
import moment from 'moment'

import icon from '../../elements/icon/icon.vue'
import themeCard from '../../elements/theme-card/theme-card.vue'
import flushImg from '../../elements/flush-img/flush-img.vue'

import {TopBottom} from '../../../../src/client/components/animations'

export default {
  'components': {
    'b-tile':            bulma('tile', 'div'),
    'b-container':       bulma('container', 'div'),
    'b-container-fluid': bulma('container-fluid', 'div'),
    'b-box':             bulma('box', 'div'),
    'b-columns':         bulma('columns', 'div'),
    'b-column':          bulma('column', 'div'),
    'b-level':           bulma('level', 'div'),
    'b-level-left':      bulma('level-left', 'div'),
    'b-level-right':     bulma('level-right', 'div'),
    'b-section':         bulma('section', 'div'),
    'b-button':          bulma('button', 'button'),
    themeCard,
    flushImg,
    icon
  },
  beforeCreate () {
    this.$store.dispatch('getFullUser', this.$route.params.id)
  },
  created () {
    setInterval(() => {
      this.time = moment()
    }, 20000)
  },
  'methods': {
    ...mapGetters([
      'user',
      'viewedUser'
    ]),
    ...new TopBottom(),
    isOnline (date) {
      return moment(this.time).diff(date) < 600000
    },
    viewedUserThemeCount () {
      if (!this.viewedUser().themes) {
        return 0
      }

      return this.viewedUser().themes.length
    }
  },
  data () {
    return {
      'time': moment()
    }
  },
  'computed': {
    lastOnlineDisplay () {
      // return 'never'
      return `Last seen ${this.viewedUser().lastSeenReason}, ${moment(this.time).to(this.viewedUser().lastSeen)}`
    }
  }
}
