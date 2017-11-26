import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'
import moment from 'moment'

import icon from '../../components/icon/icon.vue'
import themeCard from '../../components/theme-card/theme-card.vue'
import flushImg from '../../components/flush-img/flush-img.vue'
import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'

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
    navbar,
    themeCard,
    flushImg,
    icon
  },
  beforeMount () {
    this.$store.dispatch('getFullUser', this.$route.params.id)
  },
  mounted () {
    setInterval(() => {
      this.time = moment()
    }, 20000)
  },
  'methods': {
    isOnline (date) {
      return moment(this.time).diff(date) < 600000
    }
  },
  data () {
    return {
      'time': moment()
    }
  },
  'computed': {
    ...mapGetters([
      'users'
    ]),
    viewedUser () {
      if (!this.users[this.$route.params.id]) {
        return {}
      }
      return this.users[this.$route.params.id]
    },
    lastOnlineDisplay () {
      const user = this.viewedUser

      return `Last seen ${user.lastSeenReason}, ${moment(this.time).to(user.lastSeen)}`
    }
  }
}
