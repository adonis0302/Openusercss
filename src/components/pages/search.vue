<script>
  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'
  import searchField from '../elements/search-field.vue'
  import notification from '../elements/notification.vue'
  import themeCard from '../elements/theme-card.vue'
  import flushImg from '../elements/flush-img.vue'

  export default {
    'components': {
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
  }
</script>

<template lang="pug">
  include ../static/microdata/theme.pug
  include ../static/microdata/user.pug

  div.ouc-route-root
    .container
      .section
        form(@submit.prevent="submitSearch").has-bottom-margin
          .columns
            .column.is-11
              search-field(
                v-model="query",
                :value="query",
                @input="queryChange"
              )
            .column.is-1
              button.button(type="submit", :class="['button', 'is-primary', 'is-pulled-right', {'is-loading': loading}]") Search
        div(v-if="results")
          .columns
            .column.is-4
              div(v-if="!results.users.length")
                p No users found
              div(v-for="user in results.users")
                +user-microdata

                router-link(:to="'/profile/' + user._id")
                  .box.is-paddingless.is-marginless.ouc-user-card
                    .tile.is-parent.is-paddingless
                      .tile.is-4
                        .tile.is-child.ouc-user-avatar
                          flush-img(:source="user.avatarUrl", :placeholder="user.smallAvatarUrl", height="90px", align="left")
                      .tile.is-8.is-parent
                        .columns.is-vcentered
                          .column
                            .content
                              h4 {{user.displayname}}
                              p Themes: {{user.themes.length}}

            .column.is-8
              div(v-if="!results.themes.length")
                p No themes found
              div(v-for="theme in results.themes").has-bottom-margin
                +theme-microdata

                theme-card(:data-index="index", :small="true", direction="horizontal", card-class="is-primary", :theme-id="theme._id")
                  .tile.is-parent(slot="content")
                    .columns
                      .column
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
