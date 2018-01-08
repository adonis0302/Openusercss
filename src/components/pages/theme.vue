<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import {mapGetters,} from 'vuex'
  import {formatMoment,} from '../../../src/shared/time'

  import icon from '../elements/icon.vue'
  import flushImg from '../elements/flush-img.vue'
  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'
  import notification from '../elements/notification.vue'
  import bInput from '../elements/b-input.vue'

  export default {
    'components': {
      'b-tile':              bulma('tile', 'div'),
      'b-container':         bulma('container', 'div'),
      'b-container-fluid':   bulma('container-fluid', 'div'),
      'b-box':               bulma('box', 'div'),
      'b-columns':           bulma('columns', 'div'),
      'b-column':            bulma('column', 'div'),
      'b-level':             bulma('level', 'div'),
      'b-level-left':        bulma('level-left', 'div'),
      'b-level-right':       bulma('level-right', 'div'),
      'b-modal':             bulma('modal', 'div'),
      'b-modal-background':  bulma('modal-background', 'div'),
      'b-modal-content':     bulma('modal-content', 'div'),
      'b-modal-close':       bulma('modal-close', 'div'),
      'b-control':           bulma('control', 'div'),
      'b-card':              bulma('card', 'div'),
      'b-card-header':       bulma('card-header', 'div'),
      'b-card-header-title': bulma('card-header-title', 'div'),
      'b-card-header-icon':  bulma('card-header-icon', 'div'),
      'b-card-image':        bulma('card-image', 'div'),
      'b-card-content':      bulma('card-content', 'div'),
      'b-card-footer':       bulma('card-footer', 'div'),
      'b-card-footer-item':  bulma('card-footer-item', 'div'),
      oucFooter,
      navbar,
      flushImg,
      icon,
      notification,
      bInput,
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
    created () {
      if (this.$route.params.options) {
        this.options = JSON.parse(decodeURIComponent(this.$route.params.options))
      }
    },
    async beforeMount () {
      await this.$store.dispatch('getFullTheme', this.$route.params.id)

      this.$refs.flickity.rerender()
    },
    mounted () {
      if (this.options.viewingSource) {
        this.viewSource()
      }
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
          'redirect': `/profile/${this.theme.user._id}`,
        })
      },
      viewSource () {
        this.$modal.show('source-viewer')
        this.$router.replace(`/theme/${this.$route.params.id}/${encodeURIComponent(JSON.stringify({
          'viewingSource': true,
        }))}`)
      },
      closeSource () {
        this.$router.replace(`/theme/${this.$route.params.id}/${encodeURIComponent(JSON.stringify({
          'viewingSource': false,
        }))}`)
      },
      installTheme () {
        if (process.env.NODE_ENV === 'development') {
          window.open(`http://localhost:5000/theme/${this.theme._id}.user.css`)
        } else {
          window.open(`https://api.openusercss.org/theme/${this.theme._id}.user.css`)
        }
      },
    },
    'computed': {
      ...mapGetters([
        'actionErrors',
        'themes',
        'currentUser',
      ]),
      extension () {
        return process.extension
      },
      'theme': {
        'cache': false,
        get () {
          const theme = this.$db.getCollection('themes').findOne({
            '_id': this.$route.params.id,
          }) || {}
          let userId = 0

          if (theme.user && theme.user._id) {
            userId = theme.user._id
          }

          const user = this.$db.getCollection('users').findOne({
            '_id': userId,
          }) || {}

          return {
            ...theme,
            user,
          }
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../client/scss/autocolor';
  @import '../../client/scss/variables';

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
  include ../../static/microdata/theme.pug

  div.route-root
    +theme-microdata

    modal(name="delete-theme", :draggable="true", height="auto")
      form(@submit.prevent="deleteTheme")
        b-card(is-unselectable)
          b-card-header
            b-card-header-title
              .content
                h3.is-marginless Confirm theme deletion
          b-card-content
            .content
              p
                | Title: {{theme.title}}
                br
                | Created: {{theme.createdAt | moment('MMMM DD, YYYY (ZZ)')}}
                br
                | Last updated: {{theme.lastUpdate | moment('MMMM DD, YYYY (ZZ)')}}
              hr
              p Please type your theme's title here to confirm:
              b-control(has-icons-left)
                icon(icon="delete")
                b-input(
                  name="confirmTitle",
                  v-model="confirmTitle",
                  aria-label="confirm theme title",
                  :placeholder="theme.title"
                )
          b-card-footer
            b-card-footer-item(is-paddingless)
              button.button(type="submit", is-danger, is-fullbleed, :disabled="theme.title !== confirmTitle") Delete theme
            b-card-footer-item(is-paddingless)
              button.button(type="reset", @click="cancelDelete", is-fullbleed, is-borderless) Cancel

    modal(
      name="source-viewer",
      height="auto",
      :scrollable="true",
      @closed="closeSource"
    )
      b-tile(is-parent, is-paddingless)
        b-tile(is-child)
          code {{theme.content}}

    b-container(:inert="showingModal")
      div
        .section
          b-level
            b-level-left(is-marginless)
              h1 {{theme.title}}
            b-level-right
              b-tile(is-parent, is-paddingless)
                b-tile(is-child, v-if="currentUser && theme.user._id === currentUser._id")
                  .content(is-marginless, is-pulled-right)
                    button.button.is-danger(@click="confirmDeleteTheme") Delete theme
                b-tile(is-child, v-if="currentUser && theme.user._id === currentUser._id")
                  .is-marginless(is-pulled-right)
                    router-link.button.is-primary(:to="'/theme/edit/' + theme._id") Edit theme
                b-tile
                  b-tile(is-child)
                    .content.is-marginless(is-pulled-right)
                      button.button.is-primary(v-if="extension", @click="installTheme") Install theme with {{extension.name}}
                      button.button.is-primary(v-if="!extension", @click="installTheme") Install theme as usercss

          b-columns
            b-column(is-6)
              div
                b-box(is-paddingless, is-marginless).ouc-theme-card
                  flickity.carousel(ref="flickity", :options="flickityOptions")
                    flush-img(
                      v-if="hasScreenshots(theme)",
                      v-for="screenshot in theme.screenshots",
                      :source="proxyImage(screenshot).large",
                      height="250px",
                      :placeholder="proxyImage(screenshot).small",
                      align="center"
                    ).carousel-cell
                  b-column
                    b-tile(is-parent, is-paddingless)
                      b-tile(is-child, is-parent, is-vertical)
                        b-level(is-marginless)
                          b-level-left
                            router-link(:to="'/profile/' + theme.user._id")
                              button.button.is-primary
                                p Visit {{theme.user.displayname}}'s profile
                            button.button.is-primary(
                              @click="viewSource"
                            ) View source
                        br
                        p(v-if="averageRating(theme.ratings) !== 0") Average rating: {{averageRating(theme.ratings)}}
                        p(v-if="averageRating(theme.ratings) === 0") Not rated yet
                        p Created: {{formatMoment(theme.createdAt)}}
                        p Last updated: {{formatMoment(theme.lastUpdate)}}
                        p Version: {{theme.version}}
                        div(v-if="currentUser._id")
                          br
                          b-level
                            b-level-left
                              p Rate this theme:
                            b-level-right
                              star-rating(
                                :rating="averageRating(theme.ratings)",
                                :item-size="25",
                                :show-rating="false",
                                @rating-selected="sendRating"
                              )

              b-box
                vue-markdown(
                  :source="theme.description",
                  :html="false",
                  :anchor-attributes="$anchorAttributes"
                )
            b-column(is-6)
              h3 Theme options
              p A preview of options you can set in your extension
              hr
              b-columns(is-multiline)
                b-column(is-6, v-for="option in theme.options")
                  b-box
                    b {{option.label}}
                    p Type: {{option.type}}
                    p(v-if="option.possibleValues && option.possibleValues.length") {{option.possibleValues}}

    ouc-footer
</template>
