<script>
  import {formatMoment,} from '~/../lib/time'
  import {buildTheme,} from '~/../lib/usercss-builder'

  import oucFooter from '~/components/elements/ouc-footer.vue'
  import navbar from '~/components/elements/navbar.vue'
  import notification from '~/components/elements/notification.vue'
  import bInput from '~/components/bits/b-input.vue'
  import progressiveImage from '~/components/bits/progressive-image.vue'

  import starRating from 'vue-star-rating'
  import raven from 'raven-js'
  import hat from 'hat'
  import {mapGetters,} from 'vuex'

  export default {
    fetch ({store, route,}) {
      return store.dispatch('themes/single', route.params.id)
    },
    'components': {
      oucFooter,
      navbar,
      notification,
      bInput,
      starRating,
      progressiveImage,
    },
    data () {
      return {
        'options': {
          'viewingSource': false,
        },
        'confirmTitle':    '',
        'showingModal':    false,
        'flickityOptions': {
          'wrapAround':      true,
          'prevNextButtons': false,
          'pageDots':        false,
          'cellAlign':       'left',
        },
      }
    },
    'computed': {
      ...mapGetters({
        'viewer': 'session/viewer',
      }),
      theme () {
        return this.$store.getters['themes/all'].find((theme) => theme._id === this.$route.params.id)
      },
      user () {
        if (!this.theme) {
          return {}
        }

        return this.$store.getters['users/all'].find((user) => user._id === this.theme.user._id)
      },
    },
    created () {
      if (this.$route.params.options) {
        this.options = JSON.parse(decodeURIComponent(this.$route.params.options))
      }
    },
    mounted () {
      if (this.options.viewingSource) {
        this.viewSource()
      }
      const self = this

      this.$nextTick(() => {
        self.$refs.flickity.rerender()
      })
    },
    beforeDestroy () {
      this.$modal.hide('delete-theme')
      this.$modal.hide('source-viewer')
    },
    'methods': {
      formatMoment,
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
      sendRating (value) {
        this.$store.dispatch('rate', {
          'id': this.$route.params.id,
          value,
        })
      },
      proxyImage (original) {
        return {
          'large': `https://imageproxy.openusercss.org/${original}`,
          'small': `https://imageproxy.openusercss.org/50x/${original}`,
        }
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
        this.$store.dispatch('deleteTheme', {
          'id':       this.theme._id,
          'redirect': `/profile/${this.user._id}`,
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
      installTheme () {
        if (process.env.NODE_ENV === 'development') {
          window.open(`http://localhost:5000/theme/${this.theme._id}.user.css`)
        } else {
          window.open(`https://api.openusercss.org/theme/${this.theme._id}.user.css`)
        }
      },
      async installThemeEvent () {
        try {
          const self = this

          const built = await buildTheme(this.theme, this.theme.user)
          const key = hat()

          const callbackHandler = (event) => {
            if (event.data && event.data.type === 'ouc-install-callback') {
              window.removeEventListener('message', callbackHandler)

              if (event.data.key !== key) {
                const error = new Error(`${process.extension.name} didn't pass the key back correctly`)

                raven.captureException(error)
                self.$toast.error({
                  'title':   'Theme installation failed',
                  'message': error.message,
                  'timeout': 10000,
                  'theme':   'ouc',
                  'layout':  2,
                })

                throw error
              }

              self.$toast.success({
                'title':   'Theme installed',
                'message': `${this.theme.title} was installed by ${process.extension.name} successfully`,
                'timeout': 10000,
                'theme':   'ouc',
                'layout':  2,
              })
            }
          }

          window.addEventListener('message', callbackHandler)
          window.postMessage({
            'type':  'ouc-install-usercss',
            'title': this.theme.title,
            'code':  built,
            key,
          }, '*')
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
          raven.captureException(error)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../scss/autocolor';
  @import '../../scss/variables';

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
</style>

<template lang="pug">
  include ../../components/static/microdata/theme.pug

  div.ouc-route-root
    +theme-microdata

    modal(name="delete-theme", :draggable="true", height="auto")
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
        .section
          .level
            .level-left.is-marginless
              h1 {{theme.title}}
            .level-right
              .tile.is-parent.is-paddingless
                .tile.is-child(v-show="viewer && user._id === viewer._id")
                  .content.is-marginless.is-pulled-right
                    button.button.is-danger(@click="confirmDeleteTheme") Delete theme
                .tile.is-child(v-show="viewer && user._id === viewer._id")
                  .is-marginless.is-pulled-right
                    nuxt-link.button.is-primary(:to="'/theme/edit/' + theme._id") Edit theme
                .tile
                  .tile.is-child
                    .content.is-marginless.is-pulled-right
                      div(v-if="extension")
                        button.button.is-primary(
                          @click="installTheme",
                          v-if="!extension.capabilities.includes('event:install-usercss')"
                        ) Install with {{extension.name}}
                        button.button.is-primary(
                          @click="installThemeEvent",
                          v-if="extension.capabilities.includes('event:install-usercss')"
                        )
                          div(v-if="!extensionData.installed") Install with {{extension.name}}
                          div(v-if="extensionData.installed") Reinstall with {{extension.name}}
                      button.button.is-primary(v-if="!extension", @click="installTheme") Install theme as usercss

          .columns
            .column.is-6
              div
                .box.is-paddingless.is-marginless.ouc-theme-card
                  no-ssr(v-if="theme.screenshots.length")
                    flickity.carousel(ref="flickity", :options="flickityOptions")
                      progressive-image.carousel-cell(
                        v-for="screenshot in theme.screenshots",
                        :key="screenshot",
                        :src="proxyImage(screenshot).large",
                        :placeholder="proxyImage(screenshot).small",
                        width="100%",
                        height="15rem",
                        size="cover"
                      )
                    progressive-image.carousel-cell(
                      slot="placeholder",
                      :placeholder="proxyImage(theme.screenshots[0]).small",
                      width="100%",
                      height="15rem",
                      size="cover"
                    )
                  .column
                    .tile.is-parent.is-paddingless
                      .tile.is-child.is-parent.is-vertical
                        .level.is-marginless
                          .level-left
                            nuxt-link(:to="'/profile/' + user._id")
                              button.button.is-primary
                                p Visit {{theme.user.displayname}}'s profile
                            button.button.is-primary(
                              @click="viewSource"
                            ) View source
                        br
                        p(v-show="averageRating(theme.ratings) !== 0") Average rating: {{averageRating(theme.ratings)}}
                        p(v-show="averageRating(theme.ratings) === 0") Not rated yet
                        p Created: {{formatMoment(theme.createdAt)}}
                        p Last updated: {{formatMoment(theme.lastUpdate)}}
                        p Version: {{theme.version}}
                        div(v-show="viewer")
                          br
                          .level
                            .level-left
                              p Rate this theme:
                            .level-right
                              no-ssr
                                star-rating(
                                  :rating="averageRating(theme.ratings)",
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
              h3 Theme options
              p A preview of options you can set in your extension
              hr
              .columns.is-multiline
                .column.is-6(v-for="option in theme.options")
                  .box
                    b {{option.label}}
                    p Type: {{option.type}}
                    p(v-if="option.possibleValues && option.possibleValues.length") {{option.possibleValues}}

    ouc-footer
</template>
