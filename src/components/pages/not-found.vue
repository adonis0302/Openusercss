<script>
  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'
  import icon from '../elements/icon.vue'
  import themeCard from '../elements/theme-card.vue'

  export default {
    'errorStatus': 404,
    'components':  {
      oucFooter,
      navbar,
      icon,
      themeCard,
    },
    beforeMount () {
      this.$store.dispatch('getLatestThemes', 3)
    },
  }
</script>

<template lang="pug">
  div.ouc-route-root
    .container
      .section
        .columns
          .column
            h1 Not found
            hr
            p Route "{{$route.fullPath}}" is not attached to any particular page.
            p Either you clicked on a mistyped link or this page has been moved.
            hr
            p If that's not enough, you can check these themes out ^.^
            p Or if you're going back to the Internet, take these with you:
              icon(icon="shield-outline")
              icon(icon="sword")
          .column
            .column(v-for="(theme, index) in limitBy(themes, 3)")
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
