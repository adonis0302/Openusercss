<script>
  import moment from 'moment'

  import themeCard from '~/components/elements/theme-card.vue'
  import notification from '~/components/elements/notification.vue'
  import progressiveImage from '~/components/bits/progressive-image.vue'
  import bSwitch from '~/components/bits/b-switch.vue'
  import spinner from '~/components/elements/spinner.vue'

  import {mapGetters,} from 'vuex'
  import starRating from 'vue-star-rating'

  export default {
    'transition': 'fade-zoom',
    fetch ({store, route,}) {
      return Promise.all([
        store.dispatch('users/single', route.params.id),
        store.dispatch('themes/user', route.params.id),
      ])
    },
    'components': {
      themeCard,
      notification,
      progressiveImage,
      starRating,
      bSwitch,
      spinner,
    },
    beforeMount () {
      this.timeInterval = setInterval(() => {
        this.time = moment()
      }, 20000)
    },
    mounted () {
      if (this.viewer && this.viewer._id === this.$route.params.id) {
        this.viewingOwn = true
      }
    },
    beforeDestroy () {
      clearInterval(this.timeInterval)
    },
    'methods': {
      isOnline (date) {
        return moment(this.time).diff(date) < 600000
      },
      views (id) {
        return this.$store.getters['stats/theme'](id)
      },
      getUserStats () {
        if (this.showStats) {
          const gets = []

          this.themes.forEach((theme) => {
            gets.push(this.$store.dispatch('stats/hits', theme._id,))
          })

          return Promise.all(gets)
        }
      },
    },
    data () {
      return {
        'time':        moment(),
        'showStats':   null,
        'sortBy':      'createdAt',
        'sortReverse': null,
        'viewingOwn':  false,
      }
    },
    'computed': {
      ...mapGetters({
        'viewer':       'session/viewer',
        'statsError':   'stats/error',
        'statsLoading': 'stats/loading',
      }),
      sortOptions () {
        return [
          {
            'title': 'Date created',
            'value': 'createdAt',
          },
          {
            'title': 'Last update',
            'value': 'lastUpdate',
          },
          {
            'title': 'License',
            'value': 'license',
          },
          {
            'title': 'Version',
            'value': 'version',
          },
          {
            'title': 'Title',
            'value': 'title',
          },
        ]
      },
      averageRating () {
        const ratings = this.$store.getters['ratings/theme'](this.$route.params.id)
        let sum = 0

        ratings.forEach((rating) => {
          sum = sum + rating.value
        })

        const result = Math.round(sum / ratings.length * 100) / 100

        if (isNaN(result)) {
          return null
        }

        return result
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

<style lang="scss" scoped>
  .is-inline {
    display: inline-flex;
    flex-direction: row;
  }

  .is-fullwidth {
    width: 100%;
  }
</style>

<template lang="pug">
  include ../../components/static/microdata/user.pug
  include ../../components/static/microdata/theme.pug
  include ../../components/static/theme-card.pug

  .ouc-route-root
    +user-microdata

    .container.ouc-profile-container
      .ouc-profile-wrapper
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

              div(v-if="viewingOwn")
                hr
                .card.is-paddingless
                  table.table.is-striped.is-fullwidth.is-hoverable
                    thead
                      tr
                        td(colspan="2")
                          b View settings
                    tbody
                      tr
                        td
                          label(for="showStatsToggle")
                            | Show statistics
                        td.has-text-right
                          .tile.is-parent.is-paddingless
                            .tile.is-child
                              transition(name="fade-zoom")
                                spinner(
                                  v-if="statsLoading"
                                  :size="20",
                                  :spinning="statsLoading"
                                )
                            .tile.is-child
                              b-switch#showStatsToggle(
                                v-model="showStats",
                                @change="getUserStats"
                              )

                      tr
                        td
                          label(for="sortByDropdown")
                            | Sort by
                        td.has-text-right
                          .select
                            select#sortByDropdown(v-model="sortBy")
                              option(
                                v-for="option in sortOptions",
                                :key="option.value",
                                :value="option.value"
                              )
                                | {{option.title}}

                      tr
                        td
                          label(for="sortReverseToggle")
                            | Reverse order
                        td.has-text-right
                          b-switch#sortReverseToggle(
                            ref="sortReverseToggle"
                            v-model="sortReverse"
                          )

                transition(name="fade-zoom")
                  .tile.is-child.is-12(v-if="statsError && showStats")
                    hr
                    .notification.is-danger
                      p
                        fa-icon(icon="times")
                        b Error: {{statsError}}
                        br
                        br
                      p
                        | If you have an extension that filters connections,
                        | please check if that may be blocking our connection to
                        |
                        code pwk.decentm.com
                        | .
                        br
                        | OpenUserCSS uses a self-hosted Matomo instance to
                        | query statistics.
                        |
                        a(
                          href="https://forums.openusercss.org/topic/5/privacy-policy"
                          rel="noopener"
                          target="_blank"
                        ) Check the privacy policy here

            .column.is-6
              div.ouc-user-donation-wrapper(v-if="user.donationUrl && user.donationUrl !== ''", is-paddingless)
                a.button.is-primary(:href="user.donationUrl", target="_blank", rel="nofollow noopener")
                  | Support {{user.displayname}}'s themes by donating
                hr

              .columns.is-multiline(v-if="viewingOwn")
                nuxt-link.column.is-12(
                  v-for="(theme, index) in orderBy(themes, sortBy, sortReverse ? -1 : 0)",
                  :key="theme._id",
                  :to="'/theme/' + theme._id"
                )
                  +theme-microdata
                  .box
                    .level
                      b {{theme.title}}

                      p(v-if="sortBy === 'createdAt'")
                        | {{sortOptions.find((option) => option.value === sortBy).title}}:
                        | {{theme[sortBy] | moment('from', 'now')}}
                      p(v-else-if="sortBy === 'lastUpdate'")
                        | {{sortOptions.find((option) => option.value === sortBy).title}}:
                        | {{theme[sortBy] | moment('from', 'now')}}
                      p(v-else)
                        | {{sortOptions.find((option) => option.value === sortBy).title}}:
                        | {{theme[sortBy]}}

                    transition(name="fade-zoom")
                      .level(v-if="showStats && views(theme._id)")
                        table.table.is-fullwidth.is-striped.is-hoverable.is-narrow
                          tbody
                            tr(v-if="views(theme._id).nb_visits !== views(theme._id).nb_hits")
                              td Unique visitors
                              td {{views(theme._id).nb_visits}}
                            tr
                              td Views overall
                              td {{views(theme._id).nb_hits}}
                            tr
                              td Average viewing time (seconds)
                              td {{views(theme._id).nb_hits}}

              .columns.is-multiline(v-else)
                nuxt-link.column.is-6(
                  v-for="(theme, index) in themes",
                  :key="theme._id",
                  :to="'/theme/' + theme._id"
                )
                  +theme-microdata
                  +theme-card(true)
                    //- TODO: Get install count!
                    //- p.subtitle Installs: {{parseInt(Math.random() * 100, 10)}}
</template>
