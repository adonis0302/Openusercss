<script>
  import chip from '~/components/elements/chip.vue'
  import themeCard from '~/components/elements/theme-card.vue'
  import notification from '~/components/elements/notification.vue'
  import progressiveImage from '~/components/bits/progressive-image.vue'

  import {mapGetters,} from 'vuex'
  import starRating from 'vue-star-rating'

  export default {
    'transition': 'fade-zoom',
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
      'themes': 'themes/all',
    }),
    'methods': {
      averageRating (theme) {
        const ratings = this.$store.getters['ratings/theme'](theme._id)
        let sum = 0

        ratings.forEach((rating) => {
          sum = sum + rating.value
        })

        return sum / ratings.length
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

  .ouc-route-root
    .container.ouc-profile-container
      .ouc-profile-wrapper
        .section
          .columns
            .column.is-6
              h2.has-bottom-margin Newest themes
              .columns.is-multiline
                //- p {{latestThemes}}
                nuxt-link.column.is-6(
                  v-for="(theme, index) in orderBy(limitBy(themes, 6), 'createdAt', -1)",
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

            .column.is-6
              h2.has-bottom-margin Popular themes
              .columns.is-multiline
                //- p {{popularThemes}}
                nuxt-link.column.is-6(
                  v-for="(theme, index) in limitBy(themes, 6)",
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
                        //- p.subtitle {{parseInt(Math.random() * 100, 10)}} installs
</template>
