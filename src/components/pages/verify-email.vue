<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import {mapGetters,} from 'vuex'

  import spinner from '../../components/spinner/spinner.vue'
  import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
  import notification from '../../components/notification/notification.vue'

  export default {
    'components': {
      'b-section':   bulma('section', 'div'),
      'b-container': bulma('container', 'div'),
      'b-columns':   bulma('columns', 'div'),
      'b-column':    bulma('column', 'div'),
      'b-tile':      bulma('tile', 'div'),
      'b-box':       bulma('box', 'div'),
      'b-content':   bulma('content', 'div'),
      'b-button':    bulma('button', 'button'),
      oucFooter,
      notification,
      spinner,
    },
    data () {
      return {
        'token':   this.$route.params.token,
        'success': null,
      }
    },
    async mounted () {
      const {data,} = await this.$store.dispatch('verifyEmail', this.token)
      const {verifyEmail,} = data

      this.success = verifyEmail
    },
    'computed': mapGetters([
      'loading',
    ]),
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../../client/scss/autocolor';
  @import '../../../client/scss/variables';

  @import 'node_modules/bulma/sass/utilities/all';
  @import 'node_modules/bulma/sass/base/all';

  @import 'node_modules/bulma/sass/grid/columns';
  @import 'node_modules/bulma/sass/grid/tiles';
  @import 'node_modules/bulma/sass/layout/section';
  @import 'node_modules/bulma/sass/elements/box';
  @import 'node_modules/bulma/sass/elements/content';
  @import 'node_modules/bulma/sass/elements/container';
  @import 'node_modules/bulma/sass/elements/button';

  .mw500 {
    max-width: 500px;
  }

  .is-centered {
    margin: 0 auto;
  }

  .bg-success {
    background-color: nth($success, 1);
    color: nth($success, 2);
  }

  .bg-danger {
    background-color: nth($danger, 1);
    color: nth($danger, 2);
  }

  @import '../../../client/scss/reboot';
</style>

<template lang="pug">
  div.route-root
    b-container
      b-section
        b-box.mw500.is-centered(v-show="loading")
          div
            h3 Verifying your e-mail address...
            hr
            spinner(
              :spinning="loading",
              :size="100"
            )
        div(v-show="success !== null")
          b-box.bg-success.mw500.is-centered(v-show="!loading && success === true")
            p Your e-mail address was successfully verified
          b-box.bg-danger.mw500.is-centered(v-show="!loading && success === false")
            p E-mail address verification failed
          b-box.bg-danger.mw500.is-centered(v-show="!loading && success !== false && !success")
            p An error occurred while verifying your address

    ouc-footer
</template>
