<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import {mapGetters,} from 'vuex'
  import moment from 'moment'

  import icon from '../elements/icon.vue'
  import themeCard from '../elements/theme-card.vue'
  import flushImg from '../elements/flush-img.vue'
  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'
  import notification from '../elements/notification.vue'

  export default {
    'components': {
      'b-tile':            bulma('tile', 'div'),
      'b-container':       bulma('container', 'div'),
      'b-container-fluid': bulma('container-fluid', 'div'),
      'b-box':             bulma('box', 'div'),
      'b-columns':         bulma('columns', 'div'),
      'b-column':          bulma('column', 'div'),
      'b-level':           bulma('level', 'div'),
      'b-level-left':      bulma('level-left', 'div'),
      'b-level-right':     bulma('level-right', 'div'),
      oucFooter,
      navbar,
      themeCard,
      flushImg,
      icon,
      notification,
    },
    beforeMount () {
      this.$store.dispatch('getFullUser', this.$route.params.id)
      this.timeInterval = setInterval(() => {
        this.time = moment()
      }, 20000)
    },
    beforeDestroy () {
      clearInterval(this.timeInterval)
    },
    'methods': {
      isOnline (date) {
        return moment(this.time).diff(date) < 600000
      },
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
    data () {
      return {
        'time': moment(),
      }
    },
    'computed': {
      ...mapGetters([
        'currentUser',
        'actionErrors',
        'themes',
      ]),
      'user': {
        'cache': false,
        get () {
          const user = this.$db.getCollection('users').findOne({
            '_id': this.$route.params.id,
          })
          const userThemes = []

          if (user && user.themes) {
            user.themes.forEach((theme) => {
              if (theme) {
                const userTheme = this.$db.getCollection('themes').findOne({
                  '_id': theme._id,
                })

                userThemes.push(userTheme)
              }
            })
          }

          return {
            ...user,
            'themes': userThemes,
          }
        },
      },
      lastOnlineDisplay () {
        const user = this.user

        return `Last seen ${user.lastSeenReason}, ${moment(this.time).to(user.lastSeen)}`
      },
    },
  }
</script>

<template lang="pug">
  include ../static/microdata/user.pug

  div.route-root
    +user-microdata

    b-container
      div
        .section
          b-level
            b-level-left
              h1 Profile
            b-level-right(v-if="currentUser && currentUser._id === user._id")
              b-tile(is-parent, is-paddingless)
                b-tile(is-child)
                  router-link.button.is-primary(to="/theme/edit") Upload new theme
                b-tile(is-child)
                  router-link.button.is-primary(to="/account") Account
          b-columns
            b-column(is-6)
              div
                b-box(is-paddingless, is-marginless).ouc-user-card
                  b-column(is-paddingless)
                    b-tile(is-parent, is-paddingless)
                      b-tile(is-4)
                        b-tile(is-child).ouc-user-avatar
                          flush-img(:source="user.avatarUrl", :placeholder="user.smallAvatarUrl", height="185px", align="left")
                      b-tile(is-8)
                        b-tile(is-parent)
                          b-tile(is-parent)
                            b-tile(is-child, is-parent, is-vertical, is-paddingless)
                              h2 {{user.displayname}}
                              br
                              p Themes: {{user.themes ? user.themes.length : 0}}

                b-box
                  b-level(is-mobile)
                    b-level-left
                      icon(v-if="isOnline(user.lastSeen)", icon="circle", color="#06BC5A")
                      p.ouc-last-seen {{lastOnlineDisplay}}

              hr
              b-box
                .content
                  vue-markdown(
                    :source="user.bio",
                    :html="false",
                    :anchor-attributes="$anchorAttributes"
                  )
            b-column(is-6)
              div(v-if="user.donationUrl && user.donationUrl !== ''", is-paddingless)
                a.button.is-primary(:href="user.donationUrl", target="_blank", rel="nofollow noopener")
                  | Support {{user.displayname}}'s themes by donating
                hr

              b-columns(is-multiline)
                b-column(is-6, v-for="(theme, index) in user.themes")
                  theme-card(:data-index="index", :small="true", direction="horizontal", card-class="is-primary", :theme-id="theme._id").has-bottom-margin
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
                          //- p {{ ? "Not rated yet" : averageRating(theme.ratings)}}
                          h6(v-if="theme.createdAt !== theme.lastUpdate") Last updated {{theme.lastUpdate | moment('from', 'now')}}

    ouc-footer
</template>
