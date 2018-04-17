<script>
  import chip from '~/components/elements/chip.vue'
  import themeCard from '~/components/elements/theme-card.vue'
  import notification from '~/components/elements/notification.vue'
  import progressiveImage from '~/components/bits/progressive-image.vue'

  import {mapGetters,} from 'vuex'
  import starRating from 'vue-star-rating'

  export default {
    fetch ({store,}) {
      return Promise.all([
        store.dispatch('themes/latest'),
        store.dispatch('themes/popular'),
      ])
    },
    'components': {
      themeCard,
      chip,
      notification,
      progressiveImage,
      starRating,
    },
    'computed': mapGetters({
      'latestThemes':  'themes/latest',
      'popularThemes': 'themes/popular',
    }),
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
  }
</script>

<style lang="scss" scoped>
  .media-content {
    overflow: hidden;
  }
</style>

<template lang="pug">
  include ../components/static/theme-card.pug

  div.ouc-route-root
    .container
      div
        .section
          .columns.is-multiline
            .column.is-6
              h2.has-bottom-margin Newest themes
              .columns.is-multiline
                nuxt-link.column.is-6(
                  v-for="(theme, index) in limitBy(latestThemes, 6)",
                  :key="theme._id",
                  :to="'/theme/' + theme._id"
                )
                  +theme-card(true)
                    .media
                      .media-left
                        figure.image.is-48x48
                          progressive-image(
                            :src="theme.user.avatarUrl",
                            :placeholder="theme.user.smallAvatarUrl",
                            width="100%",
                            height="4rem",
                            size="contain"
                          )
                      .media-content
                        p.title.is-7 {{theme.user.displayname}}
                        p.subtitle {{theme.createdAt | moment('from', 'now')}}

            .column
              h2.has-bottom-margin Popular themes
              .columns.is-multiline
                nuxt-link.column.is-6(
                  v-for="(theme, index) in limitBy(popularThemes, 6)",
                  :key="theme._id",
                  :to="'/theme/' + theme._id"
                )
                  +theme-card(true)
                    .media
                      .media-left
                        figure.image.is-48x48
                          progressive-image(
                            :src="theme.user.avatarUrl",
                            :placeholder="theme.user.smallAvatarUrl",
                            width="100%",
                            height="4rem",
                            size="contain"
                          )
                      .media-content
                        p.title.is-7 {{theme.user.displayname}}
                        //- TODO: Get install count!
                        p.subtitle {{parseInt(Math.random() * 100, 10)}} installs
</template>
