<script>
  import notification from '~/components/elements/notification.vue'
  import oucButton from '~/components/elements/ouc-button.vue'
  import bInput from '~/components/bits/b-input.vue'
  import bSwitch from '~/components/bits/b-switch.vue'

  import {mapGetters,} from 'vuex'
  import registerMutation from '~/apollo/mutations/register.gql'

  const customDictionary = {
    'en': {
      'custom': {
        'terms': {
          'required': 'Please accept the terms of service before continuing',
        },
      },
    },
  }

  export default {
    'transition': 'fade-zoom',
    'components': {
      oucButton,
      bInput,
      notification,
      bSwitch,
    },
    data () {
      return {
        'acceptTerms':  null,
        'registerData': {
          'displayname':    '',
          'password':       '',
          'passwordVerify': '',
          'email':          '',
        },
      }
    },
    created () {
      this.$validator.localize(customDictionary)
    },
    'methods': {
      async submitRegistration () {
        const validated = await this.$validator.validateAll()

        if (validated) {
          try {
            await this.$apollo.mutate({
              'mutation':  registerMutation,
              'variables': this.registerData,
            })
            this.$router.push({
              'path': '/login',
            })
          } catch (error) {
            this.$toast.error(error.message, 'Error')
          }
        }
      },
    },
    'computed': mapGetters({
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
            form(@submit.prevent="submitRegistration").ouc-register-form
              h3 Create your OpenUserCSS account
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
                          v-model="registerData.email",
                          :class="{'input': true, 'is-danger': errors.has('email') }",
                          data-vv-as="e-mail",
                          aria-label="registration e-mail"
                        )
                  .tile.is-child
                    .field
                      .control.has-icons-left
                        fa-icon.icon(icon="user")
                        b-input(
                          type="text",
                          name="displayname",
                          autocomplete="username",
                          placeholder="Username",
                          v-validate.disable="'required|max:32'",
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
                            fa-icon.icon(icon="lock")
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
                          .control
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
                  .field
                    .control
                      label.checkbox
                        b-switch(
                          v-model="acceptTerms",
                          v-validate.disable="'required'",
                          name="terms"
                        )
                        | &nbsp;I accept the&nbsp;
                        a.has-text-primary(
                          href="https://forums.openusercss.org/topic/6/terms-of-service",
                          rel="noopener",
                          target="_blank",
                        ) terms of service (click here to view)

                  .tile.is-parent.is-vertical.is-paddingless
                    ouc-button(icon="user-plus", type="submit").is-primary
                      p(slot="content") Register
                    hr(v-show="errors.any()")
                    notification(v-show="errors.any()", icon="exclamation", color="is-danger").is-danger.error-bag
                      div(slot="content")
                        ul
                          li(v-for="error in errors.all()") {{error}}
</template>
