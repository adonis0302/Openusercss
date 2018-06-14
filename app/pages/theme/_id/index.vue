<script>
  import {formatMoment,} from '~/../lib/time'

  import notification from '~/components/elements/notification.vue'
  import bInput from '~/components/bits/b-input.vue'
  import imageCarousel from '~/components/elements/image-carousel.vue'

  import spdxList from '~/../lib/spdx-license-list'
  import starRating from 'vue-star-rating'
  import raven from 'raven-js'
  import hat from 'hat'
  import {mapGetters,} from 'vuex'
  import {stringify,} from 'usercss-meta'
  import assert from 'assert'
  import delay from 'delay'
  import path from 'path'

  const msgExtension = ({method, responseMethod, payload, hasKey,}) => new Promise((resolve, reject) => {
    assert(typeof method === 'string', 'Argument "method" must be a string')
    assert(typeof responseMethod === 'string', 'Argument "responseMethod" must be a string')
    assert(typeof payload === 'object', 'Argument "payload" must be a string')

    const key = hat()
    const callbackHandler = (event) => {
      if (event.data && event.data.type === responseMethod) {
        window.removeEventListener('message', callbackHandler)

        if (event.data.key !== key && hasKey) {
          const error = new Error([
            'Extension didn\'t pass the key back correctly',
            'Event data:',
            JSON.stringify(event.data, null, 4),
          ].join('\n'))

          raven.captureException(error)
          throw error
        }

        resolve(event.data)
      }
    }

    window.addEventListener('message', callbackHandler)
    window.postMessage({
      ...payload,
      'type': method,
      key,
    }, '*')
  })

  export default {
    'transition': 'fade-zoom',
    fetch ({store, app, route,}) {
      const gets = [
        store.dispatch('themes/single', route.params.id)
        .catch(() => {
          store.commit('themes/delete', route.params.id)
        }),

        store.dispatch('ratings/theme', {
          'id': route.params.id,
        }),
      ]

      return Promise.all(gets)
    },
    'components': {
      notification,
      bInput,
      starRating,
      imageCarousel,
    },
    data () {
      return {
        'options': {
          'viewingSource': false,
        },
        'confirmTitle': '',
        'showingModal': false,
      }
    },
    'computed': {
      ...mapGetters({
        'viewer': 'session/viewer',
      }),
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
      theme () {
        return this.$store.getters['themes/single'](this.$route.params.id)
      },
      user () {
        if (!this.theme) {
          return {}
        }

        return this.$store.getters['users/single'](this.theme.user._id)
      },
      canDoEventInstall () {
        if (!this.extension || process.server) {
          return false
        }

        return this.extension.capabilities.includes('event:install-usercss')
      },
      installLink () {
        if (process.env.NODE_ENV === 'development') {
          return `http://api.dev.openusercss.local/theme/${this.theme._id}.user.css`
        }

        return `${this.apiUrl}/${path.join('theme', `${this.theme._id}.user.css`)}`
      },
      license () {
        if (this.theme.license.toLowerCase() === 'other') {
          return {
            'name': 'Other',
            'url':  '/notice/applied-licenses',
          }
        }

        return spdxList[this.theme.license]
      },
    },
    mounted () {
      if (this.$route.query.viewingSource === 'true') {
        this.viewSource()
      }
    },
    beforeDestroy () {
      this.$modal.hide('delete-theme')
      this.$modal.hide('source-viewer')
    },
    'methods': {
      formatMoment,
      sendRating (value) {
        this.$store.dispatch('ratings/submit', {
          'id': this.$route.params.id,
          value,
        })
        .then(() => {
          this.$toast.success(`You've rated this theme with a ${value}`, 'Rating submitted')
        })
        .catch((error) => {
          this.$toast.error(error.message, 'Couldn\'t submit rating')
        })
      },
      hasScreenshots (theme) {
        return !!theme.screenshots && !!theme.screenshots.length && theme.screenshots[0] !== ''
      },
      confirmDeleteTheme () {
        this.confirmTitle = ''
        this.$modal.show('delete-theme')
      },
      cancelDelete () {
        this.$modal.hide('delete-theme')
      },
      deleteTheme () {
        this.$store.dispatch('themes/delete', this.theme._id)
        .then((data) => {
          this.$toast.success('The requested theme was successfully deleted', 'Theme deleted')
          this.$router.push(`/profile/${this.viewer._id}`)
        })
        .catch((error) => {
          this.$toast.error(error.message, 'Error while deleting theme')
        })
      },
      viewSource () {
        this.$modal.show('source-viewer')
        this.$router.replace({
          'query': {
            'viewingSource': true,
          },
        })
      },
      closeSource () {
        this.$router.replace({
          'query': {
            'viewingSource': false,
          },
        })
      },
      async installThemeEvent () {
        try {
          /* eslint-disable-next-line prefer-template */
          const rendered = stringify({
            'name':         this.theme.title,
            'namespace':    `https://openusercss.org/theme/${this.theme._id}`,
            'homepageURL':  `https://openusercss.org/theme/${this.theme._id}`,
            'version':      this.theme.version,
            'license':      this.theme.license,
            'description':  this.theme.description,
            'vars':         this.theme.variables,
            'author':       `${this.theme.user.displayname} (https://openusercss.org/profile/${this.theme.user._id})`,
            'preprocessor': 'uso',
          }, {
            'alignKeys': true,
          }) + `\n\n${this.theme.content}\n`

          const sent = await msgExtension({
            'hasKey':         true,
            'method':         'ouc-install-usercss',
            'responseMethod': 'ouc-install-callback',
            'payload':        {
              'title': this.theme.title,
              'code':  rendered,
            },
          })

          const checkp = msgExtension({
            'hasKey':         false,
            'method':         'ouc-is-installed',
            'responseMethod': 'ouc-is-installed-response',
            'payload':        {
              'name':      this.theme.title,
              'namespace': `https://openusercss.org/theme/${this.theme._id}`,
            },
          })
          const waitp = delay(200)
          const result = await Promise.race([
            checkp,
            waitp,
          ])

          assert(
            typeof result === 'object',
            `${this.extension.name} returned non-object value or has failed to respond in 200ms`
          )
          assert(
            result.style.enabled === true,
            `${this.extension.name} was unable to install ${this.theme.title}`
          )

          this.$toast.success(
            `${this.theme.title} was installed by ${this.extension.name} successfully`,
            'Theme installed',
          )

          return {
            ...sent,
            ...result,
          }
        } catch (error) {
          this.$toast.error(error.message, 'Theme installation failed')

          // eslint-disable-next-line no-console
          console.error(error)
          raven.captureException(error)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/component';

  code {
    display: block;
    padding: 1rem;
    white-space: pre-wrap
  }

  .is-warning {
    background-color: nth($warning, 1);
    color: nth($warning, 2);
  }

  .is-banner {
    padding-bottom: .4rem;
    padding-top: .4rem;
    padding-left: .6rem;
    padding-right: .6rem;
    white-space: nowrap;
  }

  .extension-icon {
    height: 1rem;
    width: 1rem;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    margin-right: .25rem;
  }
</style>

<template lang="pug">
  include ../../../components/static/microdata/theme.pug

  div.ouc-route-root
    div(v-if="theme")
      +theme-microdata

    modal(
      v-if="theme"
      name="delete-theme"
      :draggable="true"
      height="auto"
    )
      form(@submit.prevent="deleteTheme")
        .card.is-unselectable
          .card-header
            .card-header-title
              .content
                h3.is-marginless Confirm theme deletion
          .card-content
            .content
              p
                | Title: {{theme.title}}
                br
                | Created: {{theme.createdAt | moment('MMMM DD, YYYY (ZZ)')}}
                br
                | Last updated: {{theme.lastUpdate | moment('MMMM DD, YYYY (ZZ)')}}
              hr
              p Please type your theme's title here to confirm:
              .control.has-icons-left
                fa-icon.icon(icon="trash-alt")
                b-input(
                  name="confirmTitle",
                  v-model="confirmTitle",
                  aria-label="confirm theme title",
                  :placeholder="theme.title"
                )
          .card-footer
            .card-footer-item.is-paddingless
              button.button.is-danger.is-fullbleed(type="submit", :disabled="theme.title !== confirmTitle") Delete theme
            .card-footer-item.is-paddingless
              button.button.is-fullbleed.is-borderless(type="reset", @click="cancelDelete") Cancel

    modal(
      v-if="theme",
      name="source-viewer",
      height="auto",
      :scrollable="true",
      @closed="closeSource"
    )
      .tile.is-parent.is-paddingless
        .tile.is-child
          code {{theme.content}}

    .container(:inert="showingModal")
      div
        .section(v-if="!theme")
          .notification.is-danger
            .level
              .level-left
                fa-icon(icon="times")
                p
                  | No themes were found that match your query.
                  | You either clicked on a broken link, or mistyped the URL.

        .section(v-else)
          .level
            .level-left.is-marginless
              h1 {{theme.title}}
            .level-right
              .tile.is-parent.is-paddingless.is-brand-primary
                .tile.is-child(v-show="viewer && user._id === viewer._id")
                  .content.is-marginless.is-pulled-right
                    button.button.is-danger(@click="confirmDeleteTheme") Delete theme
                .tile.is-child(v-show="viewer && user._id === viewer._id")
                  .is-marginless.is-pulled-right
                    nuxt-link.button.is-primary.is-backgroundless(:to="'/theme/edit/' + theme._id") Edit theme
                .tile
                  .tile.is-child
                    .content.is-marginless.is-pulled-right
                      a.button.is-primary.is-backgroundless(
                        :href="installLink",
                        target="_blank",
                      ) Install as usercss

              | &nbsp;
              .tile.is-parent.is-paddingless(v-if="canDoEventInstall && extension")
                .tile
                  .tile.is-child
                    button.button.is-brand-primary(
                      @click="installThemeEvent",
                      v-if="extension.capabilities.includes('event:install-usercss')"
                    )
                      .extension-icon(:style="{'background-image': 'url(' + extension.icon + ')'}")
                      | Install with {{extension.name}}

          .columns
            .column.is-6
              div
                .box.is-paddingless.is-marginless.ouc-theme-card
                  image-carousel(
                    v-model="theme.screenshots"
                  )
                  .column
                    .tile.is-parent.is-paddingless
                      .tile.is-child.is-parent.is-vertical
                        .level.is-marginless
                          .level-left
                            nuxt-link(:to="'/profile/' + user._id")
                              button.button.is-brand-primary
                                p Visit {{theme.user.displayname}}'s profile
                            | &nbsp;
                            button.button.is-grey-light(
                              @click="viewSource"
                            ) View source
                        br

                        p(v-if="averageRating") Average rating: {{averageRating}}
                        p(v-else) Not rated yet
                        p Created: {{formatMoment(theme.createdAt)}}
                        p Last updated: {{formatMoment(theme.lastUpdate)}}
                        p Version: {{theme.version}}
                        div(v-if="theme.license === 'Other'")
                          br
                          .notification.is-primary.is-marginless
                            fa-icon(icon="info")
                            | {{theme.user.displayname}} has applied their
                            | own license to this theme.
                            br
                            | Please see the description below for details.

                        div(v-else)
                          | License:&nbsp;
                          a.has-text-primary(
                            :href="license.url",
                            target="_blank",
                            ref="noopener nofollow"
                          ) {{license.name}}
                          | &nbsp;
                          nuxt-link.has-text-secondary(to="/notice/applied-licenses")
                            | (notice)

                        div(v-show="viewer")
                          br
                          .level
                            .level-left
                              p Rate this theme:
                            .level-right
                              no-ssr
                                star-rating(
                                  :rating="averageRating",
                                  :star-size="25",
                                  :show-rating="false",
                                  @rating-selected="sendRating"
                                )

              .box
                vue-markdown(
                  :source="theme.description",
                  :html="false",
                  :anchor-attributes="$anchorAttributes"
                )
            .column.is-6
              h3 Theme variables
              p A preview of options you can set in your extension
              hr
              .columns.is-multiline
                .column.is-6(v-for="variable in theme.variables")
                  .card
                    .card-header
                      p.card-header-title
                        | {{variable.label}}
                    .card-content
                      p Type: {{variable.type}}
                      p Name: {{variable.name}}
                      p Default: {{variable.value || variable.default}}
</template>
