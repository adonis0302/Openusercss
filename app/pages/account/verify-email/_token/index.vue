<script>
  import spinner from '~/components/elements/spinner.vue'
  import notification from '~/components/elements/notification.vue'

  export default {
    'transition': 'fade-zoom',
    'components': {
      notification,
      spinner,
    },
    data () {
      return {
        'result':    null,
        // loading, success, failure
        'status':    'loading',
        'timer':     null,
        'countdown': 7,
      }
    },
    'computed': {
      token () {
        return this.$route.params.token
      },
      viewer () {
        return this.$store.getters['session/viewer']
      },
    },
    mounted () {
      if (this.status === 'success') {
        this.timer = setInterval(() => {
          this.countdown = this.countdown - 1

          if (!this.countdown) {
            if (this.viewer) {
              this.$router.push('/account')
            } else {
              this.$router.push('/login')
            }
          }
        }, 1000)
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    async asyncData ({store, route,}) {
      let result = false
      let status = 'loading'

      try {
        await store.dispatch('account/verifyEmail', route.params.token)
        result = 'Your e-mail address has been verified.'
        status = 'success'
      } catch (error) {
        result = error.message
        status = 'failure'
      }

      return {
        result,
        status,
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/component';

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
        div(v-if="status === 'success'")
          .notification.is-primary
            .level
              .level-left
                fa-icon(icon="check")
                p {{result}}

          p Redirecting in {{countdown}}
        div(v-if="status === 'failure'")
          .notification.is-danger
            .level
              .level-left
                fa-icon(icon="times")
                p {{result}}
</template>
