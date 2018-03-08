<script>
  import oucFooter from '~/components/elements/ouc-footer.vue'
  import navbar from '~/components/elements/navbar.vue'

  import notification from '~/components/elements/notification.vue'
  import oucButton from '~/components/elements/ouc-button.vue'
  import bInput from '~/components/bits/b-input.vue'

  import gql from 'graphql-tag'

  export default {
    'components': {
      oucButton,
      notification,
      oucFooter,
      navbar,
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
      async submitLogin () {
        const validated = await this.$validator.validateAll()

        if (validated) {
          await this.$apollo.mutate({
            'mutation': gql`
              mutation(
                $email:    String!
                $password: String!
              ) {
                login(
                  email:    $email
                  password: $password
                ) {
                  token
                }
              }
            `,
            'variables': this.loginData,
          })
        }
      },
    },
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
            form(@submit.prevent="submitLogin").ouc-login-form
              h3 Log in to OpenUserCSS
              hr
              .tile.is-ancestor
                .tile.is-parent.is-vertical
                  .tile.is-child
                    .field
                      .control.has-icons-left
                        fa-icon.icon(icon="envelope")
                        b-input(
                          type="email",
                          name="email",
                          autocomplete="email",
                          placeholder="E-mail",
                          v-validate.disable="'required|email'",
                          v-model.lazy="loginData.email",
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
                            b-input(
                              type="password",
                              name="password",
                              autocomplete="current-password",
                              placeholder="Passphrase",
                              v-validate.disable="'required'",
                              v-model.lazy="loginData.password"
                              :class="{'input': true, 'is-danger': errors.has('password') }",
                              data-vv-as="passphrase",
                              aria-label="login passphrase"
                            )
                  .tile.is-parent.is-vertical.is-paddingless
                    ouc-button(icon="user-plus").is-primary
                      p(slot="content") Login
                    hr(v-show="errors.any()")
                    notification(v-show="errors.any()", icon="exclamation", color="is-danger").is-danger
                      div(slot="content")
                        ul
                          li(v-for="error in errors.all()") {{error}}

    ouc-footer
</template>
