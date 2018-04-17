<script>
  import moment from 'moment'

  import themeCard from '~/components/elements/theme-card.vue'
  import notification from '~/components/elements/notification.vue'
  import progressiveImage from '~/components/bits/progressive-image.vue'

  import {mapGetters,} from 'vuex'
  import starRating from 'vue-star-rating'

  export default {
    fetch ({store, route,}) {
      return store.dispatch('users/single', route.params.id)
    },
    'components': {
      themeCard,
      notification,
      progressiveImage,
      starRating,
    },
    beforeMount () {
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
      ...mapGetters({
        'viewer': 'session/viewer',
      }),
      viewingOwn () {
        if (!this.viewer) {
          return false
        }

        if (this.viewer._id === this.$route.params.id) {
          return true
        }

        return false
      },
      user () {
        return this.$store.getters['users/all'].find((user) => user._id === this.$route.params.id)
      },
      themes () {
        return this.$store.getters['themes/all'].filter((theme) => theme.user._id === this.$route.params.id)
      },
      lastOnlineDisplay () {
        const user = this.user

        return `Last seen ${user.lastSeenReason}, ${moment(this.time).to(user.lastSeen)}`
      },
    },
  }
</script>

<template lang="pug">
  include ../../components/static/microdata/user.pug
  include ../../components/static/microdata/theme.pug
  include ../../components/static/theme-card.pug

  div.ouc-route-root
    +user-microdata

    .container.ouc-profile-container
      div.ouc-profile-wrapper
        .section
          .level
            .level-left
              h1 {{user.displayname | placeholder('Profile')}}
            .level-right.ouc-profile-action-buttons(v-show="viewer && viewer._id === user._id")
              .tile.is-parent.is-paddingless.is-brand-primary
                .tile.ouc-new-theme-button-wrapper.is-child
                  nuxt-link.button.is-backgroundless.is-borderless.has-text-white.ouc-new-theme-button(to="/theme/edit")
                    | Upload new theme
                .tile.ouc-account-button-wrapper.is-child
                  nuxt-link.button.is-backgroundless.is-borderless.has-text-white.ouc-account-button(to="/account")
                    | Account
          .columns
            .column.is-6
              .card
                .card-content.is-brand-primary
                  .columns
                    .column.is-4.is-hcentered
                      figure.image.has-indicator
                        fa-icon(v-if="isOnline(user.lastSeen)", icon="circle", color="#06BC5A")
                        progressive-image(
                          :src="user.avatarUrl",
                          :placeholder="user.smallAvatarUrl",
                          height="7.5rem",
                          width="7.5rem",
                          size="cover",
                          position="center center",
                          :circular="true"
                        )
                    .column.is-8
                      p @{{user.username}}
                      hr
                      p.ouc-last-seen {{lastOnlineDisplay}}

                .card-content
                  .content.ouc-user-bio-wrapper
                    vue-markdown.ouc-user-bio(
                      v-if="user.bio",
                      :source="user.bio",
                      :html="false",
                      :anchor-attributes="$anchorAttributes"
                    )
                    p(v-else)
                      | {{user.displayname}} has not written a bio yet.

            .column.is-6
              div.ouc-user-donation-wrapper(v-if="user.donationUrl && user.donationUrl !== ''", is-paddingless)
                a.button.is-primary(:href="user.donationUrl", target="_blank", rel="nofollow noopener")
                  | Support {{user.displayname}}'s themes by donating
                hr

              .columns.is-multiline(v-if="viewingOwn")
                nuxt-link.column.is-12(
                  v-for="(theme, index) in themes",
                  :key="theme._id",
                  :to="'/theme/' + theme._id"
                )
                  +theme-microdata
                  .box
                    .level
                      b {{theme.title}}
                      p Created {{theme.createdAt | moment('Do MMMM YYYY')}}

              .columns.is-multiline(v-else)
                nuxt-link.column.is-6(
                  v-for="(theme, index) in themes",
                  :key="theme._id",
                  :to="'/theme/' + theme._id"
                )
                  +theme-microdata
                  +theme-card
                    //- TODO: Get install count!
                    p.subtitle Installs: {{parseInt(Math.random() * 100, 10)}}
</template>
