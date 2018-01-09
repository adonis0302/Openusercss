<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import {mapGetters,} from 'vuex'

  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'

  import icon from '../elements/icon.vue'
  import notification from '../elements/notification.vue'
  import oucButton from '../elements/ouc-button.vue'
  import bInput from '../bits/b-input.vue'

  export default {
    'components': {
      'b-columns':   bulma('columns', 'div'),
      'b-column':    bulma('column', 'div'),
      'b-box':       bulma('box', 'div'),
      'b-container': bulma('container', 'div'),
      'b-field':     bulma('field', 'div'),
      'b-label':     bulma('label', 'label'),
      'b-textarea':  bulma('textarea', 'textarea'),
      'b-select':    bulma('select', 'select'),
      'b-control':   bulma('control', 'div'),
      'b-checkbox':  bulma('checkbox', 'checkbox'),
      'b-radio':     bulma('radio', 'radio'),
      'b-help':      bulma('help', 'p'),
      'b-tile':      bulma('tile', 'div'),
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
        b-container(style="max-width: 500px;").ouc-centered
          b-box.ouc-form-box
            form(@submit.prevent="submitLogin").ouc-login-form
              h3 Log in to OpenUserCSS
              hr
              b-tile(is-ancestor)
                b-tile(is-parent, is-vertical)
                  b-tile(is-child)
                    b-field
                      b-control(has-icons-left)
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
                  b-tile(is-child)
                    b-columns
                      b-column
                        b-field
                          b-control(has-icons-left)
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
                  b-tile(is-parent, is-vertical, is-paddingless)
                    ouc-button(icon="account-plus").is-primary
                      p(slot="content") Login
                    notification(v-show="errors.any()", icon="alert", color="is-danger").is-danger
                      div(slot="content")
                        ul
                          li(v-for="error in errors.all()") {{error}}

    ouc-footer
</template>
