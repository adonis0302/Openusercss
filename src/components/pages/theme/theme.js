import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'
import {formatMoment} from '../../../src/shared/time'

import icon from '../../components/icon/icon.vue'
import flushImg from '../../components/flush-img/flush-img.vue'
import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import notification from '../../components/notification/notification.vue'
import bInput from '../../components/b-input/b-input.vue'

export default {
  'components': {
    'b-tile':              bulma('tile', 'div'),
    'b-container':         bulma('container', 'div'),
    'b-container-fluid':   bulma('container-fluid', 'div'),
    'b-box':               bulma('box', 'div'),
    'b-columns':           bulma('columns', 'div'),
    'b-column':            bulma('column', 'div'),
    'b-level':             bulma('level', 'div'),
    'b-level-left':        bulma('level-left', 'div'),
    'b-level-right':       bulma('level-right', 'div'),
    'b-modal':             bulma('modal', 'div'),
    'b-modal-background':  bulma('modal-background', 'div'),
    'b-modal-content':     bulma('modal-content', 'div'),
    'b-modal-close':       bulma('modal-close', 'div'),
    'b-control':           bulma('control', 'div'),
    'b-card':              bulma('card', 'div'),
    'b-card-header':       bulma('card-header', 'div'),
    'b-card-header-title': bulma('card-header-title', 'div'),
    'b-card-header-icon':  bulma('card-header-icon', 'div'),
    'b-card-image':        bulma('card-image', 'div'),
    'b-card-content':      bulma('card-content', 'div'),
    'b-card-footer':       bulma('card-footer', 'div'),
    'b-card-footer-item':  bulma('card-footer-item', 'div'),
    oucFooter,
    navbar,
    flushImg,
    icon,
    notification,
    bInput
  },
  data () {
    return {
      'options': {
        'viewingSource': false
      },
      'confirmTitle':    '',
      'showingModal':    false,
      'flickityOptions': {
        'wrapAround':      true,
        'prevNextButtons': false,
        'pageDots':        false,
        'cellAlign':       'left'
      }
    }
  },
  created () {
    if (this.$route.params.options) {
      this.options = JSON.parse(decodeURIComponent(this.$route.params.options))
    }
  },
  beforeMount () {
    this.$store.dispatch('getFullTheme', this.$route.params.id)
  },
  mounted () {
    if (this.options.viewingSource) {
      this.viewSource()
    }
  },
  beforeDestroy () {
    this.$modal.hide('delete-theme')
    this.$modal.hide('source-viewer')
  },
  'methods': {
    formatMoment,
    proxyImage (original) {
      return {
        'large': `https://imageproxy.openusercss.org/${original}`,
        'small': `https://imageproxy.openusercss.org/50x/${original}`
      }
    },
    hasScreenshots (theme) {
      return !!theme.screenshots && !!theme.screenshots.length && theme.screenshots[0] !== ''
    },
    confirmDeleteTheme () {
      this.confirmTitle = ''
      this.$modal.show('delete-theme')
    },
    cancelDelete () {
      this.$modal.hide('delete-theme')
    },
    deleteTheme () {
      this.$store.dispatch('deleteTheme', {
        'id':       this.viewedTheme._id,
        'redirect': `/profile/${this.viewedTheme.user._id}`
      })
    },
    viewSource () {
      this.$modal.show('source-viewer')
      this.$router.replace(`/theme/${this.$route.params.id}/${encodeURIComponent(JSON.stringify({
        'viewingSource': true
      }))}`)
    },
    closeSource () {
      this.$router.replace(`/theme/${this.$route.params.id}/${encodeURIComponent(JSON.stringify({
        'viewingSource': false
      }))}`)
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
      'themes',
      'currentUser'
    ]),
    'viewedTheme': {
      'cache': false,
      get () {
        const theme = this.$db.getCollection('themes').findOne({
          '_id': this.$route.params.id
        }) || {}
        let userId = 0

        if (theme.user && theme.user._id) {
          userId = theme.user._id
        }

        const user = this.$db.getCollection('users').findOne({
          '_id': userId
        }) || {}

        return {
          ...theme,
          user
        }
      }
    }
  }
}
