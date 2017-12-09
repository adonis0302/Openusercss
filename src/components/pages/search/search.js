import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'

import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import searchField from '../../components/search-field/search-field.vue'
import notification from '../../components/notification/notification.vue'
import themeCard from '../../components/theme-card/theme-card.vue'
import flushImg from '../../components/flush-img/flush-img.vue'

export default {
  'components': {
    'b-section':   bulma('section', 'div'),
    'b-container': bulma('container', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    'b-tile':      bulma('tile', 'div'),
    'b-box':       bulma('box', 'div'),
    'b-content':   bulma('content', 'div'),
    'b-button':    bulma('button', 'button'),
    attributor,
    navbar,
    searchField,
    notification,
    themeCard,
    flushImg
  },
  data () {
    return {
      'results': null,
      'query':   this.$route.params.terms,
      'page':    0
    }
  },
  async mounted () {
    if (this.query) {
      await this.submitSearch()
    }
  },
  'methods': {
    async submitSearch () {
      const searchResults = await this.$store.dispatch('search', {
        'terms': this.query,
        'limit': 25,
        'skip':  0
      })

      this.results = searchResults
    },
    queryChange (value) {
      this.$router.replace(`/search/${value}`)
    }
  },
  'computed': mapGetters([
    'actionErrors',
    'loading'
  ])
}
