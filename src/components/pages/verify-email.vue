<script>
  import {mapGetters,} from 'vuex'

  import spinner from '../elements/spinner.vue'
  import oucFooter from '../elements/ouc-footer.vue'
  import notification from '../elements/notification.vue'

  export default {
    'components': {
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
  @import '../../client/scss/autocolor';
  @import '../../client/scss/variables';

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
</style>

<template lang="pug">
  div.ouc-route-root
    .container
      .section
        .box.mw500.is-centered(v-show="loading")
          div
            h3 Verifying your e-mail address...
            hr
            spinner(
              :spinning="loading",
              :size="100"
            )
        div(v-show="success !== null")
          .box.bg-success.mw500.is-centered(v-show="!loading && success === true")
            p Your e-mail address was successfully verified
          .box.bg-danger.mw500.is-centered(v-show="!loading && success === false")
            p E-mail address verification failed
          .box.bg-danger.mw500.is-centered(v-show="!loading && success !== false && !success")
            p An error occurred while verifying your address

    ouc-footer
</template>
