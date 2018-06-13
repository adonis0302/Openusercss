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
      const get = Promise.all([
        store.dispatch('themes/latest'),
        store.dispatch('themes/popular'),
      ]).then(() => store.dispatch('stats/refill'))

      return get
    },
    'components': {
      themeCard,
      chip,
      notification,
      progressiveImage,
      starRating,
    },
    'computed': {
      ...mapGetters({
        'themes':     'themes/all',
        'stats':      'stats/all',
        'themeStats': 'stats/theme',
        'statsError': 'stats/error',
      }),
      popularThemes () {
        const merged = this.themes.map((theme) => {
          const statsExist = Boolean(this.stats[theme._id])

          if (!statsExist) {
            return null
          }

          return {
            theme,
            'stat': this.stats[theme._id],
          }
        })
        const withStats = merged.filter((item) => Boolean(item))
        const results = withStats.sort((base, compare) => compare.stat.nb_hits - base.stat.nb_hits)

        return results.map((item) => item.theme)
      },
    },
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

  .is-fullwidth {
    width: 100%;
  }

  .has-text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

<template lang="pug">
  include ../components/static/theme-card.pug

  .ouc-route-root
    .container.ouc-main-container
      .ouc-main-wrapper
        .section
          .notification.is-danger(v-if="statsError")
            p
              fa-icon(icon="exclamation")
              |
              | {{statsError}}
          .columns
            .column.is-3
              h2.has-bottom-margin Newest themes
              .columns.is-multiline
                nuxt-link.column.is-12(
                  v-for="(theme, index) in orderBy(limitBy(themes, 7), 'createdAt', -1)",
                  :key="theme._id",
                  :to="'/theme/' + theme._id"
                )
                  +theme-card(false, true)
                    .columns.is-mobile.is-fullwidth
                      .column.is-3
                        progressive-image(
                          :src="theme.user.avatarUrl",
                          :placeholder="theme.user.smallAvatarUrl",
                          width="3rem",
                          height="3rem",
                          size="contain",
                          position="center left"
                        )
                      .column.has-text-right.has-text-ellipsis
                        p {{theme.title | truncate(18)}}
                        p {{theme.createdAt | moment('from', 'now')}}

            .column.is-9
              h2.has-bottom-margin Popular themes
              .columns.is-multiline
                nuxt-link.column.is-4(
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
                            height="3rem",
                            size="contain"
                          )
                      .media-content
                        b {{theme.user.displayname}}
                        p
                          | {{themeStats(theme._id).nb_hits}}
                          | {{themeStats(theme._id).nb_hits | pluralize('visit')}}
</template>
