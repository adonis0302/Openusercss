<script>
  import oucFooter from '../components/elements/ouc-footer.vue'

  export default {
    'components': {
      oucFooter,
    },
    'props': [
      'error',
    ],
    'methods': {
      encode (string) {
        return Buffer.from(JSON.stringify(string)).toString('base64')
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
                p An unknown error occurred while rendering "{{error.path}}".

            br
            nuxt-link(to="/")
              | If that's not enough, click here to return to the home page ^.^
            p Or if you're going back to the Internet, take these with you:&nbsp;&nbsp;
              fa-icon(icon="chess-pawn")
              fa-icon(icon="quidditch")

            div(v-if="error.statusCode !== 404")
              hr
              p
                | Please include the information on the right when submitting an issue!
            br
          .column.is-6
            h4 Debugging information
            hr
            pre(@click="select") {{encode(error)}}

    ouc-footer
</template>
