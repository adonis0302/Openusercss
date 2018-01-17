<script>
  import {mapGetters,} from 'vuex'

  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'

  import icon from '../elements/icon.vue'
  import notification from '../elements/notification.vue'
  import oucButton from '../elements/ouc-button.vue'
  import bInput from '../bits/b-input.vue'

  export default {
    'components': {
      oucButton,
      icon,
      notification,
      oucFooter,
      navbar,
      bInput,
    },
    'data': () => {
      return {
        'login': {
          'email':    '',
          'password': '',
        },
      }
    },
    'methods': {
      async submitLogin () {
        const validated = await this.$validator.validateAll()

        if (validated) {
          await this.$store.dispatch('login', this.login)
        }
      },
    },
    'computed': mapGetters([
      'actionErrors',
    ]),
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
                        icon(icon="mail-ru")
                        b-input(
                          type="email",
                          name="email",
                          placeholder="E-mail",
                          v-validate.disable="'required|email'",
                          v-model.lazy="login.email",
                          :class="{'input': true, 'is-danger': errors.has('email') }",
                          data-vv-as="e-mail",
                          aria-label="login e-mail"
                        )
                  .tile.is-child
                    .columns
                      .column
                        .field
                          .control.has-icons-left
                            icon(icon="lock")
                            b-input(
                              type="password",
                              name="password",
                              placeholder="Passphrase",
                              v-validate.disable="'required'",
                              v-model.lazy="login.password"
                              :class="{'input': true, 'is-danger': errors.has('password') }",
                              data-vv-as="passphrase",
                              aria-label="login passphrase"
                            )
                  .tile.is-parent.is-vertical.is-paddingless
                    ouc-button(icon="account-plus").is-primary
                      p(slot="content") Login
                    hr(v-show="errors.any()")
                    notification(v-show="errors.any()", icon="alert", color="is-danger").is-danger
                      div(slot="content")
                        ul
                          li(v-for="error in errors.all()") {{error}}

    ouc-footer
</template>
