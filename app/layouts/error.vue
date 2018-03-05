<script>
  import oucFooter from '../components/elements/ouc-footer.vue'

  export default {
    'components': {
      oucFooter,
    },
    'props': [
      'error',
    ],
  }
</script>

<template lang="pug">
  div.ouc-route-root
    .container
      .section
        .columns
          .column
            h1 {{error.statusCode}}
            h4 {{error.message}}
            hr
            .ouc-error-container(:class="['status-' + error.statusCode]")
              .ouc-error-description(v-if="error.statusCode === 404")
                p Route "{{$route.fullPath}}" is not attached to any particular page.
                p Either you clicked on a mistyped link or this page has been moved.

              .ouc-error-description(v-if="error.statusCode !== 404")
                p An unknown error occurred while rendering "{{error.path}}".

            br
            p If that's not enough, you can check these themes out ^.^
            p Or if you're going back to the Internet, take these with you:&nbsp;&nbsp;
              fa-icon(icon="chess-pawn")
              fa-icon(icon="quidditch")

            hr
            p
              | Please include the following information when submitting an issue:
            br
            pre {{error}}
          .column
            //- .column(v-for="(theme, index) in limitBy(themes, 3)")
              theme-card(:data-index="index", direction="horizontal", card-class="is-primary", :theme-id="theme._id").has-bottom-margin
                .tile.is-parent(slot="content")
                  .tile.is-child
                    .columns
                      .column
                        h4 {{theme.title}}
                        br
                        h6 By {{theme.user.displayname}}
                        h6 Last updated {{theme.lastUpdate | moment('from', 'now')}}
    ouc-footer
</template>
