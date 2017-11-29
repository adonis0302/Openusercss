import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'
// import hljs from 'highlight.js'
import {formatMoment} from '../../../src/shared/time'

import icon from '../../components/icon/icon.vue'
import themeCard from '../../components/theme-card/theme-card.vue'
import flushImg from '../../components/flush-img/flush-img.vue'
import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import notification from '../../components/notification/notification.vue'

export default {
  'components': {
    'b-tile':             bulma('tile', 'div'),
    'b-container':        bulma('container', 'div'),
    'b-container-fluid':  bulma('container-fluid', 'div'),
    'b-box':              bulma('box', 'div'),
    'b-columns':          bulma('columns', 'div'),
    'b-column':           bulma('column', 'div'),
    'b-level':            bulma('level', 'div'),
    'b-level-left':       bulma('level-left', 'div'),
    'b-level-right':      bulma('level-right', 'div'),
    'b-section':          bulma('section', 'div'),
    'b-button':           bulma('button', 'button'),
    'b-content':          bulma('content', 'div'),
    'b-modal':            bulma('modal', 'div'),
    'b-modal-background': bulma('modal-background', 'div'),
    'b-modal-content':    bulma('modal-content', 'div'),
    'b-modal-close':      bulma('modal-close', 'div'),
    attributor,
    navbar,
    themeCard,
    flushImg,
    icon,
    notification
  },
  beforeMount () {
    this.$store.dispatch('getFullTheme', this.$route.params.id)
  },
  data () {
    return {
      'viewingSource': false
    }
  },
  'methods': {
    formatMoment,
    viewSource () {
      this.viewingSource = !this.viewingSource
    },
    installTheme () {
      if (process.env.NODE_ENV === 'development') {
        window.open(`http://localhost:5000/theme/${this.viewedTheme._id}.user.css`)
      } else {
        window.open(`https://api.openusercss.org/theme/${this.viewedTheme._id}.user.css`)
      }
    }
  },
  'computed': {
    ...mapGetters([
      'actionErrors',
      'themes'
    ]),
    'viewedTheme': {
      'cache': false,
      get () {
        if (!this.themes[this.$route.params.id]) {
          return {
            'user': {}
          }
        }
        return this.themes[this.$route.params.id]
      }
    }
  }
}
