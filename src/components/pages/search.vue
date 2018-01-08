<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import {mapGetters,} from 'vuex'

  import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
  import navbar from '../../components/navbar/navbar.vue'
  import searchField from '../../components/search-field/search-field.vue'
  import notification from '../../components/notification/notification.vue'
  import themeCard from '../../components/theme-card/theme-card.vue'
  import flushImg from '../../components/flush-img/flush-img.vue'

  export default {
    'components': {
      'b-container': bulma('container', 'div'),
      'b-columns':   bulma('columns', 'div'),
      'b-column':    bulma('column', 'div'),
      'b-tile':      bulma('tile', 'div'),
      'b-box':       bulma('box', 'div'),
      'b-content':   bulma('content', 'div'),
      oucFooter,
      navbar,
      searchField,
      notification,
      themeCard,
      flushImg,
    },
    data () {
      return {
        'results': null,
        'query':   this.$route.params.terms,
        'page':    0,
      }
    },
    async mounted () {
      if (this.query) {
        await this.submitSearch()
      }
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
      },
      async submitSearch () {
        const searchResults = await this.$store.dispatch('search', {
          'terms': this.query,
          'limit': 25,
          'skip':  0,
        })

        this.results = searchResults
      },
      queryChange (value) {
        this.$router.replace(`/search/${value}`)
      },
    },
    'computed': mapGetters([
      'actionErrors',
      'loading',
    ]),
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../../client/scss/autocolor';
  @import '../../../client/scss/variables';

  @import 'node_modules/bulma/sass/utilities/all';
  @import 'node_modules/bulma/sass/base/all';

  @import 'node_modules/bulma/sass/grid/columns';
  @import 'node_modules/bulma/sass/grid/tiles';
  @import 'node_modules/bulma/sass/layout/section';
  @import 'node_modules/bulma/sass/elements/box';
  @import 'node_modules/bulma/sass/elements/content';
  @import 'node_modules/bulma/sass/elements/container';
  @import 'node_modules/bulma/sass/elements/button';

  @import '../../../client/scss/reboot';
</style>

<template lang="pug">
  include ../../static/microdata/theme.pug
  include ../../static/microdata/user.pug

  div.route-root
    b-container
      .section
        form(@submit.prevent="submitSearch").has-bottom-margin
          b-columns
            b-column(is-11)
              search-field(
                v-model="query",
                :value="query",
                @input="queryChange"
              )
            b-column(is-1)
              button.button(type="submit", :class="['button', 'is-primary', 'is-pulled-right', {'is-loading': loading}]") Search
        div(v-if="results")
          b-columns
            b-column(is-4)
              div(v-if="!results.users.length")
                p No users found
              div(v-for="user in results.users")
                +user-microdata

                router-link(:to="'/profile/' + user._id")
                  b-box(is-paddingless, is-marginless).ouc-user-card
                    b-tile(is-parent, is-paddingless)
                      b-tile(is-4)
                        b-tile(is-child).ouc-user-avatar
                          flush-img(:source="user.avatarUrl", :placeholder="user.smallAvatarUrl", height="90px", align="left")
                      b-tile(is-8, is-parent)
                        b-columns(is-vcentered)
                          b-column
                            b-content
                              h4 {{user.displayname}}
                              p Themes: {{user.themes.length}}

            b-column(is-8)
              div(v-if="!results.themes.length")
                p No themes found
              div(v-for="theme in results.themes").has-bottom-margin
                +theme-microdata

                theme-card(:data-index="index", :small="true", direction="horizontal", card-class="is-primary", :theme-id="theme._id")
                  b-tile(slot="content", is-parent)
                    b-columns
                      b-column
                        h4 {{theme.title}}
                        br
                        p(v-if="averageRating(theme.ratings) === 0") Not rated yet
                        p(v-if="averageRating(theme.ratings) !== 0")
                          star-rating(
                            :rating="averageRating(theme.ratings)",
                            :item-size="10",
                            :show-rating="false",
                            :read-only="true"
                          )
                        h6 Created {{theme.createdAt | moment('from', 'now')}}
                        h6(v-if="theme.createdAt !== theme.lastUpdate") Last updated {{theme.lastUpdate | moment('from', 'now')}}
    ouc-footer
</template>
