import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import moment from 'moment'
import {mapGetters} from 'vuex'

import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import flushImg from '../../components/flush-img/flush-img.vue'
import icon from '../../components/icon/icon.vue'

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
    attributor,
    flushImg,
    navbar,
    icon
  },
  beforeCreate () {
    this.$store.dispatch('getFullUser', this.$route.params.id)
  },
  mounted () {
    setInterval(() => {
      this.time = moment()
    }, 20000)
  },
  'methods': {
    ...mapGetters([
      'user',
      'viewedUser'
    ]),
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
      return `Last seen ${this.viewedUser().lastSeenReason}, ${moment(this.time).to(this.viewedUser().lastSeen)}`
    }
  }
}
