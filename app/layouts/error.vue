<script>
  import oucFooter from '../components/elements/ouc-footer.vue'
  import pkg from '~/../package.json'
  import assert from 'assert'

  export default {
    'transition': 'fade',
    'components': {
      oucFooter,
    },
    'props': [
      'error',
    ],
    data () {
      return {
        'userMessage':    '',
        'showCommentBox': null,
      }
    },
    'computed': {
      commentPlaceholder () {
        return [
          'Type additional info or your comments here\n',
          'They will be inserted into the information below',
        ].join('')
      },
      extendedError () {
        if (process.server) {
          return Object.assign(this.error, {
            'location': 'ssr',
            'version':  pkg.version,
            'time':     new Date(),
          }, {})
        }

        const {
          productSub,
          vendor,
          hardwareConcurrency,
          appCodeName,
          appName,
          platform,
          product,
          userAgent,
          language,
          languages,
          onLine,
          doNotTrack,
          deviceMemory,
        } = window.clientInformation

        const collects = [
          'script',
          'link',
          'style',
        ]
        const $items = []
        const items = []

        collects.forEach((collect) => {
          document.querySelectorAll(collect).forEach((element) => {
            $items.push(element)
          })
        })

        const firstPartyClues = [
          'window.__NUXT__={',
          'http://github.com/OpenUserCSS/',
          'http://decentm.com',
          'https://decentm.com',
          'https://fontawesome.com',
          'sourceMappingURL',
          window.origin,
        ]

        const assetFirstParty = (asset) => {
          assert(
            asset instanceof HTMLElement,
            'Asset validator must be passed an instance of HTMLElement'
          )

          let result = false
          let data = null
          const backoff = asset.innerHTML.length > 50000

          switch (asset.nodeName) {
          case 'SCRIPT':
            if (backoff) {
              data = asset.src
            } else if (!data) {
              data = asset.innerHTML
            }
            break
          case 'LINK':
            data = asset.href
            break
          case 'STYLE':
            if (asset.parentElement.tagName === 'HEAD') {
              return {
                'result': true,
                'data':   '',
              }
            }

            if (backoff) {
              data = asset.src
            } else if (!data) {
              data = asset.innerHTML
            }
            break
          default:
            data = asset.innerHTML
            break
          }

          firstPartyClues.forEach((clue) => {
            if (!data) {
              result = true
              return
            }

            if (data.includes(clue)) {
              result = true
            }
          })

          return {
            result,
            data,
          }
        }

        $items.forEach((element) => {
          const {result, data,} = assetFirstParty(element)

          if (!result) {
            items.push(data)
          }
        })

        const state = window.localStorage.getItem(`ouc-state-${pkg.version}`) || ''

        return Object.assign(this.error, {
          'location':             'hydrated',
          'userMessage':          this.userMessage,
          'version':              pkg.version,
          'localStorageBytes':    state.length,
          'timezoneOffset':       new Date().getTimezoneOffset(),
          'time':                 new Date(),
          'workerRegistered':     Boolean(navigator.serviceWorker.controller),
          /* eslint-disable-next-line no-underscore-dangle */
          'vueDevtoolsInstalled': Boolean(window.__VUE_DEVTOOLS_GLOBAL_HOOK__),
          'extension':            this.extension,
          items,
          'viewport':             {
            'width':  window.innerWidth,
            'height': window.innerHeight,
          },
          'clientInformation': {
            userAgent,
            productSub,
            vendor,
            hardwareConcurrency,
            appCodeName,
            appName,
            platform,
            product,
            onLine,
            doNotTrack,
            deviceMemory,
            language,
            languages,
          },
        }, {})
      },
    },
    'methods': {
      encode (value) {
        return Buffer.from(JSON.stringify(value, null, 4)).toString('base64')
      },
      select (event) {
        if (process.client) {
          const range = document.createRange()

          range.selectNode(event.target)
          window.getSelection().removeAllRanges()
          window.getSelection().addRange(range)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  pre {
    word-wrap: break-word;
    white-space: pre-line;
    max-height: 20rem;
  }
</style>

<template lang="pug">
  transition(name="error")
    .ouc-route-root
      .container
        .section
          .columns
            .column.is-6
              h1 {{error.statusCode}}
              h4 {{error.message}}
              hr
              .ouc-error-container(:class="['status-' + error.statusCode]")
                .ouc-error-description(v-if="error.statusCode === 404")
                  p
                    | Route "{{$route.fullPath | truncate(50)}}" is not attached
                    | to any particular page.
                  p Either you clicked on a mistyped link or this page has been moved.

                .ouc-error-description(v-if="error.statusCode !== 404")
                  p An unknown error occurred while rendering "{{error.path || $route.fullPath}}".

              br
              nuxt-link.has-text-primary(to="/")
                | If that's not enough, click here to return to the home page ^.^
              p Or if you're going back to the Internet, take these with you:&nbsp;&nbsp;
                fa-icon(icon="shield-alt")
                fa-icon(icon="quidditch")

              div(v-if="error.statusCode !== 404")
                hr
                p
                  | Please include the information on the right when submitting an issue!
              br
            .column.is-6
              h4 Debugging information
              br
              button.button.is-primary(v-if="!showCommentBox", @click="showCommentBox = true")
                | Leave a comment
              div(v-if="showCommentBox")
                textarea.textarea.input(
                  type="text",
                  v-model="userMessage",
                  :placeholder="commentPlaceholder"
                )
                p
                  br
                  | When you're done typing, please copy this wall of text
                  | below and&nbsp;
                  a.has-text-primary(
                    href="//github.com/OpenUserCSS/openusercss.org/issues",
                    target="_blank",
                    rel="noopener"
                  ) submit an issue on GitHub!
              hr
              pre(@click="select") {{encode(extendedError)}}
</template>
