<script>
  import {cloneDeep,} from 'lodash'

  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'
  import searchField from '../elements/search-field.vue'
  import chip from '../elements/chip.vue'
  import themeCard from '../elements/theme-card.vue'
  import flushImg from '../elements/flush-img.vue'
  import notification from '../elements/notification.vue'

  export default {
    'components': {
      searchField,
      oucFooter,
      themeCard,
      flushImg,
      navbar,
      chip,
      notification,
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
      },
    },
    'asyncComputed': {
      'latestThemes': {
        'cache':   false,
        'default': [],
        async get () {
          const self = this
          const result = this.$db.getCollection('themes').chain().find()
          const themes = result
          .simplesort('createdAt', true)
          .data()

          if (themes) {
            const finalThemes = await Promise.all(themes.filter(async (theme) => {
              theme.user = await self.getUser(theme.user)
              return theme
            }))

            return finalThemes
          }

          return []
        },
      },
      'popularThemes': {
        'cache':   false,
        'default': [],
        async get () {
          const self = this
          const result = this.$db.getCollection('themes').chain().find()
          const themes = result
          .simplesort('ratings', true)
          .data()

          if (themes) {
            const finalThemes = await Promise.all(themes.filter(async (theme) => {
              theme.user = await self.getUser(theme.user)
              return theme
            }))

            return finalThemes
          }

          return []
        },
      },
    },
  }
</script>

<template lang="pug">
  div.ouc-route-root
    .container
      div
        .section
          .columns
            .column
              h2.has-bottom-margin Newest themes
              .columns.is-multiline
                .column.is-6(v-for="(theme, index) in limitBy(latestThemes, 6)")
                    theme-card(
                      :small="true",
                      :theme-id="theme._id",
                      :data-index="index",
                      direction="horizontal",
                      card-class="is-primary",
                      itemtype="SoftwareApplication"
                    ).has-bottom-margin
                      .tile.is-parent(slot="content")
                        p {{theme}}
                        .columns
                          .column
                            h4(itemprop="name") {{theme.title}}
                            h6(itemprop="author", itemtype="Person") by {{theme.user.displayname}}
                              meta(itemprop="name", :value="theme.user.displayname")
                              meta(itemprop="url", :value="'/profile/' + theme.user._id")
                            h6 {{theme.createdAt | moment('from', 'now')}}
                            meta(itemprop="dateCreated", :value="theme.createdAt")
                            meta(itemprop="dateModified", :value="theme.lastUpdate")
                            meta(itemprop="url", :value="'/theme/' + theme._id")

            .column
              h2.has-bottom-margin Popular themes
              .columns.is-multiline
                .column.is-6(v-for="(theme, index) in limitBy(popularThemes, 6)")
                  theme-card(:small="true", :theme-id="theme._id", :data-index="index", direction="horizontal", card-class="is-primary").has-bottom-margin
                    .tile.is-parent(slot="content")
                      .tile.is-child
                        h4 {{theme.title}}
                        div(v-if="averageRating(theme.ratings) !== 0")
                          br
                          star-rating(
                            :rating="averageRating(theme.ratings)",
                            :item-size="10",
                            :show-rating="false",
                            :read-only="true"
                          )
                        h6 by {{theme.user.displayname}}
                        p(v-if="theme.ratings && theme.ratings.length === 0") Not rated yet
                        p(v-if="theme.ratings && theme.ratings.length !== 0") Has {{theme.ratings.length}} ratings

    ouc-footer
</template>
