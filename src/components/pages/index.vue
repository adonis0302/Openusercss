<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import {mapGetters,} from 'vuex'

  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'
  import searchField from '../elements/search-field.vue'
  import chip from '../elements/chip.vue'
  import themeCard from '../elements/theme-card.vue'
  import flushImg from '../elements/flush-img.vue'
  import notification from '../elements/notification.vue'

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
    'computed': {
      ...mapGetters([
        'actionErrors',
        'themes',
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
              '_id': themes[index].user._id,
            })
          })

          return themes
        },
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
              '_id': themes[index].user._id,
            })
          })

          return themes
        },
      },
    },
  }
</script>

<template lang="pug">
  div.route-root
    b-container
      div
        .section
          b-columns
            b-column
              h2.has-bottom-margin Newest themes
              b-columns(is-multiline)
                b-column(is-6, v-for="(theme, index) in limitBy(latestThemes, 6)")
                    theme-card(
                      :small="true",
                      :theme-id="theme._id",
                      :data-index="index",
                      direction="horizontal",
                      card-class="is-primary",
                      itemtype="SoftwareApplication"
                    ).has-bottom-margin
                      b-tile(slot="content", is-parent)
                        b-columns
                          b-column
                            h4(itemprop="name") {{theme.title}}
                            h6(itemprop="author", itemtype="Person") by {{theme.user.displayname}}
                              meta(itemprop="name", :value="theme.user.displayname")
                              meta(itemprop="url", :value="'/profile/' + theme.user._id")
                            h6 {{theme.createdAt | moment('from', 'now')}}
                            meta(itemprop="dateCreated", :value="theme.createdAt")
                            meta(itemprop="dateModified", :value="theme.lastUpdate")
                            meta(itemprop="url", :value="'/theme/' + theme._id")

            b-column
              h2.has-bottom-margin Popular themes
              b-columns(is-multiline)
                b-column(is-6, v-for="(theme, index) in limitBy(popularThemes, 6)")
                  theme-card(:small="true", :theme-id="theme._id", :data-index="index", direction="horizontal", card-class="is-primary").has-bottom-margin
                    b-tile(slot="content", is-parent)
                      b-tile(is-child)
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
