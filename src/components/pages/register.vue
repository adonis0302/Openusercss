<script>
  import flushImg from '../elements/flush-img.vue'
  import icon from '../elements/icon.vue'
  import notification from '../elements/notification.vue'
  import oucButton from '../elements/ouc-button.vue'
  import bInput from '../bits/b-input.vue'

  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'

  export default {
    'components': {
      oucButton,
      bInput,
      flushImg,
      icon,
      notification,
      oucFooter,
      navbar,
    },
    data () {
      return {
        'registerData': {
          'displayname':    '',
          'password':       '',
          'passwordVerify': '',
          'email':          '',
        },
      }
    },
    'methods': {
      async submitRegistration () {
        const validated = await this.$validator.validateAll()

        if (validated) {
          this.$store.dispatch('register', this.registerData)
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
            form(@submit.prevent="submitRegistration").ouc-register-form
              h3 Create your OpenUserCSS account
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
                          autocomplete="email",
                          placeholder="E-mail",
                          v-validate.disable="'required|email'",
                          v-model="registerData.email",
                          :class="{'input': true, 'is-danger': errors.has('email') }",
                          data-vv-as="e-mail",
                          aria-label="registration e-mail"
                        )
                  .tile.is-child
                    .field
                      .control.has-icons-left
                        icon(icon="account")
                        b-input(
                          type="text",
                          name="displayname",
                          autocomplete="username",
                          placeholder="Username",
                          v-validate.disable="'required|alpha_num'",
                          v-model="registerData.displayname"
                          :class="{'input': true, 'is-danger': errors.has('displayname') }",
                          data-vv-as="displayname",
                          aria-label="registration displayname"
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
                              autocomplete="new-password",
                              placeholder="Passphrase",
                              v-validate.disable="'required'",
                              v-model="registerData.password",
                              :class="{'input': true, 'is-danger': errors.has('password') }",
                              data-vv-as="passphrase",
                              aria-label="registration passphrase"
                            )
                      .column
                        .field
                          .control.has-icons-left
                            icon(icon="lock-plus")
                            b-input(
                              type="password",
                              name="passwordVerify",
                              autocomplete="new-password",
                              placeholder="Verify passphrase",
                              v-validate.disable="'required|confirmed:password'",
                              v-model="registerData.passwordVerify",
                              :class="{'input': true, 'is-danger': errors.has('passwordVerify') }",
                              data-vv-as="passphrase verification",
                              aria-label="registration passphrase, again"
                            )
                  .tile.is-parent.is-vertical.is-paddingless
                    ouc-button(icon="account-plus").is-primary
                      p(slot="content") Register
                    hr(v-show="errors.any()")
                    notification(v-show="errors.any()", icon="alert", color="is-danger").is-danger
                      div(slot="content")
                        ul
                          li(v-for="error in errors.all()") {{error}}

    ouc-footer
</template>
