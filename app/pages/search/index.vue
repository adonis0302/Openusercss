<script>
  import oucFooter from '~/components/elements/ouc-footer.vue'
  import navbar from '~/components/elements/navbar.vue'
  import notification from '~/components/elements/notification.vue'
  import themeCard from '~/components/elements/theme-card.vue'
  import progressiveImage from '~/components/bits/progressive-image.vue'

  import {mapGetters,} from 'vuex'
  import moment from 'moment'

  export default {
    'components': {
      oucFooter,
      navbar,
      notification,
      themeCard,
      progressiveImage,
    },
    data () {
      return {
        'query': this.$route.query.terms,
        'page':  0,
      }
    },
    async fetch ({store, route,}) {
      if (route.query.terms) {
        await store.dispatch('search/submit', {
          'terms': route.query.terms,
        })
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
        try {
          await this.$store.dispatch('search/submit', {
            'terms': this.query,
            'limit': 25,
            'skip':  0,
          })
        } catch (error) {
          /* eslint-disable-next-line no-console */
          console.error(error)
          this.$toast.error(error.message, 'Error')
        }
      },
      queryChange (event) {
        this.$router.replace({
          'query': {
            'terms': event.target.value,
          },
        })
      },
      isOnline (user) {
        const ago = moment().diff(moment(user.lastSeen), 'minutes')

        return ago <= 10
      },
    },
    'computed': {
      ...mapGetters({
        'loading': 'search/loading',
      }),
      results () {
        const noResults = {
          'users':  [],
          'themes': [],
        }

        if (!this.$store) {
          return noResults
        }

        return this.$store.getters['search/single'](this.$route.query.terms)
          || noResults
      },
    },
  }
</script>

<style lang="scss" scoped>
  .ouc-ccenter {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<template lang="pug">
  include ../../components/static/microdata/theme.pug
  include ../../components/static/microdata/user.pug

  div.ouc-route-root
    .container
      .section
        form(@submit.prevent="submitSearch").has-bottom-margin
          .columns
            .column.is-11
              .control.ouc-search-field.has-icons-left
                fa-icon.icon(icon="search")
                input.input(
                  v-model="query",
                  @input="queryChange",
                  name="search",
                  placeholder="Search themes and users",
                  aria-label="Search themes and users"
                )
            .column.is-1
              button.button.is-primary.is-pulled-right(
                type="submit",
                :class="{'is-loading': loading}"
              ) Search

        .columns
          .column.is-4
            div(v-if="!results.users.length")
              p No users found
            .columns.is-multiline
              .column.is-6(v-for="user in results.users")
                +user-microdata

                router-link(:to="'/profile/' + user._id")
                  .card
                    .card-header.is-primary
                      .level.card-header-title.is-mobile
                        .level-left
                          fa-icon(v-if="!isOnline(user)", icon="user")
                          fa-icon(v-else, icon="circle", color="#06BC5A")
                        .level-right
                          p.is-pulled-right {{user.displayname}}
                    .card-image
                      figure.image
                        progressive-image(
                          :raw="true",
                          :src="user.avatarUrl",
                          :placeholder="user.smallAvatarUrl",
                          width="100%"
                        )

          .column.is-8
            div(v-if="!results.themes.length")
              p No themes found
            .columns.is-multiline
              .column.is-4(v-for="(theme, index) in results.themes")
                +theme-microdata

                theme-card(:data-index="index", :small="true", direction="horizontal", card-class="is-primary", :theme-id="theme._id")
                  .tile.is-parent(slot="content")
                    .columns
                      .column
                        h4 {{theme.title}}
                        br
                        p(v-if="averageRating(theme.ratings) !== 0")
                          star-rating(
                            :rating="averageRating(theme.ratings)",
                            :item-size="10",
                            :show-rating="false",
                            :read-only="true"
                          )
                        h6(v-if="theme.createdAt === theme.lastUpdate") Created {{theme.createdAt | moment('from', 'now')}}
                        h6(v-else) Last updated {{theme.lastUpdate | moment('from', 'now')}}
    ouc-footer
</template>
