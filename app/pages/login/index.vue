<script>
  import notification from '~/components/elements/notification.vue'
  import oucButton from '~/components/elements/ouc-button.vue'
  import bInput from '~/components/bits/b-input.vue'

  import {mapGetters,} from 'vuex'

  export default {
    'transition': 'fade-zoom',
    'components': {
      oucButton,
      notification,
      bInput,
    },
    'data': () => {
      return {
        'loginData': {
          'email':    '',
          'password': '',
        },
      }
    },
    'methods': {
      async login () {
        const valid = await this.$validator.validateAll()

        if (valid) {
          try {
            await this.$store.dispatch('session/login', this.loginData)
            this.$router.push({
              'path': '/',
            })
          } catch (error) {
            this.$toast.error(error.message, 'Error')
          }
        }
      },
    },
    mounted () {
      if (this.viewer) {
        this.$router.push({
          'path': '/',
        })
      }
    },
    'computed': mapGetters({
      'viewer':  'session/viewer',
      'loading': 'session/loading',
    }),
  }
</script>

<style lang="scss" scoped>
  .ouc-centered {
    margin: 0 auto;
  }
</style>

<template lang="pug">
  div.ouc-route-root
    .section(slot="form").ouc-form-section
      .container(style="max-width: 500px;").ouc-centered
        .box.ouc-form-box
          form(@submit.prevent="login").ouc-login-form
            h3 Log in to OpenUserCSS
            hr
            .tile.is-ancestor
              .tile.is-parent.is-vertical
                .tile.is-child
                  .field
                    .control.has-icons-left
                      fa-icon.icon(icon="envelope")
                      input.input(
                        type="email",
                        name="email",
                        autocomplete="email",
                        placeholder="E-mail",
                        v-validate.disable="'required|email'",
                        v-model="loginData.email",
                        :class="{'input': true, 'is-danger': errors.has('email') }",
                        data-vv-as="e-mail",
                        aria-label="login e-mail"
                      )
                .tile.is-child
                  .columns
                    .column
                      .field
                        .control.has-icons-left
                          fa-icon.icon(icon="lock")
                          input.input(
                            type="password",
                            name="password",
                            autocomplete="current-password",
                            placeholder="Passphrase",
                            v-validate.disable="'required'",
                            v-model="loginData.password"
                            :class="{'input': true, 'is-danger': errors.has('password') }",
                            data-vv-as="passphrase",
                            aria-label="login passphrase"
                          )
                .tile.is-parent.is-vertical.is-paddingless
                  ouc-button.is-primary(icon="user-plus", :loading="loading", type="submit")
                    p(slot="content") Login
                  hr(v-show="errors.any()")
                  notification.is-danger.error-bag(v-show="errors.any()", icon="exclamation", color="is-danger")
                    div(slot="content")
                      ul
                        li(v-for="error in errors.all()") {{error}}
</template>
