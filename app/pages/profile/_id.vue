<script>
  import moment from 'moment'

  import themeCard from '~/components/elements/theme-card.vue'
  import oucFooter from '~/components/elements/ouc-footer.vue'
  import navbar from '~/components/elements/navbar.vue'
  import notification from '~/components/elements/notification.vue'
  import progressiveImage from '~/components/bits/progressive-image.vue'

  import {mapGetters,} from 'vuex'

  export default {
    fetch ({store, route,}) {
      return store.dispatch('users/single', route.params.id)
    },
    'components': {
      oucFooter,
      navbar,
      themeCard,
      notification,
      progressiveImage,
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

  div.ouc-route-root
    +user-microdata

    .container.ouc-profile-container
      div.ouc-profile-wrapper
        .section
          .level
            .level-left
              h1 Profile
            .level-right.ouc-profile-action-buttons(v-show="viewer && viewer._id === user._id")
              .tile.is-parent.is-paddingless
                .tile.ouc-new-theme-button-wrapper.is-child
                  nuxt-link.button.is-primary.ouc-new-theme-button(to="/theme/edit") Upload new theme
                .tile.ouc-account-button-wrapper.is-child
                  nuxt-link.button.is-primary.ouc-account-button(to="/account") Account
          .columns
            .column.is-6
              div
                .box.is-paddingless.is-marginless.ouc-user-card
                  .column.is-paddingless
                    .tile.is-parent.is-paddingless
                      .tile.is-4
                        .tile.is-child.ouc-user-avatar
                          progressive-image(
                            :src="user.avatarUrl",
                            :placeholder="user.smallAvatarUrl",
                            height="10rem",
                            width="10rem"
                          )
                      .tile.is-8
                        .tile.is-parent.ouc-user-details
                          .tile.is-parent
                            .tile.is-child.is-parent.is-vertical.is-paddingless
                              h2 {{user.displayname}}
                              br
                              p Themes: {{themes ? themes.length : 0}}

                .box
                  .level.is-mobile
                    .level-left.ouc-last-seen-wrapper
                      fa-icon(v-if="isOnline(user.lastSeen)", icon="circle", color="#06BC5A")
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
                .column.is-6(v-for="(theme, index) in themes")
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
