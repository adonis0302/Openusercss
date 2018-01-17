<script>
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

  div.ouc-route-root
    +user-microdata

    .container.ouc-profile-container
      div.ouc-profile-wrapper
        .section
          .level
            .level-left
              h1 Profile
            .level-right.ouc-profile-action-buttons(v-if="currentUser && currentUser._id === user._id")
              .tile.is-parent.is-paddingless
                .tile.ouc-new-theme-button-wrapper.is-child
                  router-link.button.is-primary.ouc-new-theme-button(to="/theme/edit") Upload new theme
                .tile.ouc-account-button-wrapper.is-child
                  router-link.button.is-primary.ouc-account-button(to="/account") Account
          .columns
            .column.is-6
              div
                .box.is-paddingless.is-marginless.ouc-user-card
                  .column.is-paddingless
                    .tile.is-parent.is-paddingless
                      .tile.is-4
                        .tile.is-child.ouc-user-avatar
                          flush-img(:source="user.avatarUrl", :placeholder="user.smallAvatarUrl", height="185px", align="left")
                      .tile.is-8
                        .tile.is-parent.ouc-user-details
                          .tile.is-parent
                            .tile.is-child.is-parent.is-vertical.is-paddingless
                              h2 {{user.displayname}}
                              br
                              p Themes: {{user.themes ? user.themes.length : 0}}

                .box
                  .level.is-mobile
                    .level-left.ouc-last-seen-wrapper
                      icon(v-if="isOnline(user.lastSeen)", icon="circle", color="#06BC5A")
                      p.ouc-last-seen {{lastOnlineDisplay}}

              hr
              .box
                .content.ouc-user-bio-wrapper
                  vue-markdown.ouc-user-bio(
                    :source="user.bio",
                    :html="false",
                    :anchor-attributes="$anchorAttributes"
                  )
            .column.is-6
              div.ouc-user-donation-wrapper(v-if="user.donationUrl && user.donationUrl !== ''", is-paddingless)
                a.button.is-primary(:href="user.donationUrl", target="_blank", rel="nofollow noopener")
                  | Support {{user.displayname}}'s themes by donating
                hr

              .columns.is-multiline
                .column.is-6(v-for="(theme, index) in user.themes")
                  theme-card(:data-index="index", :small="true", direction="horizontal", card-class="is-primary", :theme-id="theme._id").has-bottom-margin
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
                          h6(v-if="theme.createdAt !== theme.lastUpdate") Last updated {{theme.lastUpdate | moment('from', 'now')}}

    ouc-footer
</template>
