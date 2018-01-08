<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import {mapGetters,} from 'vuex'

  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'
  import icon from '../elements/icon.vue'
  import themeCard from '../elements/theme-card.vue'

  export default {
    'errorStatus': 404,
    'components':  {
      'b-container': bulma('container', 'div'),
      'b-columns':   bulma('columns', 'div'),
      'b-column':    bulma('column', 'div'),
      'b-box':       bulma('box', 'div'),
      'b-tile':      bulma('tile', 'div'),
      oucFooter,
      navbar,
      icon,
      themeCard,
    },
    beforeMount () {
      this.$store.dispatch('getLatestThemes', 3)
    },
    'computed': {
      ...mapGetters([
        'actionErrors',
        'themes',
      ]),
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../../client/scss/autocolor';
  @import '../../../client/scss/variables';

  @import 'node_modules/bulma/sass/utilities/all';
  @import 'node_modules/bulma/sass/base/all';

  @import 'node_modules/bulma/sass/elements/container';
  @import 'node_modules/bulma/sass/grid/columns';
  @import 'node_modules/bulma/sass/grid/tiles';
  @import 'node_modules/bulma/sass/layout/section';
  @import 'node_modules/bulma/sass/elements/box';

  @import '../../../client/scss/reboot';
</style>

<template lang="pug">
  div.route-root
    b-container
      .section
        b-columns
          b-column
            h1 Not found
            hr
            p Route "{{$route.fullPath}}" is not attached to any particular page.
            p Either you clicked on a mistyped link or this page has been moved.
            hr
            p If that's not enough, you can check these themes out ^.^
            p Or if you're going back to the Internet, take these with you:
              icon(icon="shield-outline")
              icon(icon="sword")
          b-column
            b-column(v-for="(theme, index) in limitBy(themes, 3)")
              theme-card(:data-index="index", direction="horizontal", card-class="is-primary", :theme-id="theme._id").has-bottom-margin
                b-tile(slot="content", is-parent)
                  b-tile(is-child)
                    b-columns
                      b-column
                        h4 {{theme.title}}
                        br
                        h6 By {{theme.user.displayname}}
                        h6 Last updated {{theme.lastUpdate | moment('from', 'now')}}
    ouc-footer
</template>
