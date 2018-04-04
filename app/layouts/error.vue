<script>
  import oucFooter from '../components/elements/ouc-footer.vue'
  import pkg from '~/../package.json'

  import CircularJSON from 'circular-json'

  export default {
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
          return this.error
        }

        const ourClientInfo = {}

        /* eslint-disable-next-line guard-for-in */
        for (const i in navigator) {
          ourClientInfo[i] = clientInformation[i]
        }

        return Object.assign(this.error, {
          'version':           pkg.version,
          'clientInformation': ourClientInfo,
          'route':             this.$route,
          'userMessage':       this.userMessage,
        }, {})
      },
    },
    'methods': {
      encode (value) {
        return Buffer.from(CircularJSON.stringify(value)).toString('base64')
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
  div.ouc-route-root
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

    ouc-footer
</template>
