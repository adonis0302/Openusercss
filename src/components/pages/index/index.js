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
    this.$store.dispatch('getPopularThemes', 6)
  },
  'methods': {
    averageRating (array) {
      let sum = 0

      if (!array) {
        return sum
      }

      array.forEach((rating) => {
        if (!rating.value) {
          throw new Error('Rating has no value')
        }

        sum = sum + rating.value
      })

      const result = sum / array.length

      if (isNaN(result)) {
        return 0
      }
      return result
    }
  },
  'computed': {
    ...mapGetters([
      'actionErrors',
      'themes'
    ]),
    'latestThemes': {
      'cache': false,
      get () {
        const result = this.$db.getCollection('themes').chain()
        const themes = result
        .find()
        .simplesort('createdAt', true)
        .data()

        themes.forEach((theme, index) => {
          themes[index].user = this.$db.getCollection('users').findOne({
            '_id': themes[index].user._id
          })
        })

        return themes
      }
    },
    'popularThemes': {
      'cache': false,
      get () {
        const result = this.$db.getCollection('themes').chain()
        const themes = result
        .find()
        .simplesort('ratings', true)
        .data()

        themes.forEach((theme, index) => {
          themes[index].user = this.$db.getCollection('users').findOne({
            '_id': themes[index].user._id
          })
        })

        return themes
      }
    }
  }
}
