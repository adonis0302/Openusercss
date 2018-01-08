<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import {mapGetters,} from 'vuex'

  import flushImg from '../elements/flush-img.vue'
  import icon from '../elements/icon.vue'
  import notification from '../elements/notification.vue'
  import oucButton from '../elements/ouc-button.vue'
  import bInput from '../elements/b-input.vue'

  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'

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
      bInput,
      flushImg,
      icon,
      notification,
      oucFooter,
      navbar,
    },
    data () {
      return {
        'register': {
          'displayname':    '',
          'password':       '',
          'passwordVerify': '',
          'email':          '',
        },
      }
    },
    'computed': mapGetters([
      'actionErrors',
    ]),
    'methods': {
      async submitRegistration () {
        const validated = await this.$validator.validateAll()

        if (validated) {
          this.$store.dispatch('register', this.register)
        }
      },
    },
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
  @import 'node_modules/bulma/sass/elements/box';
  @import 'node_modules/bulma/sass/elements/form';
  @import 'node_modules/bulma/sass/layout/section';

  .ouc-centered {
    margin: 0 auto;
  }

  @import '../../../client/scss/reboot';
</style>

<template lang="pug">
  div.route-root
    .section(slot="form").ouc-form-section
        b-container(style="max-width: 500px;").ouc-centered
          b-box.ouc-form-box
            form(@submit.prevent="submitRegistration").ouc-register-form
              h3 Create your OpenUserCSS account
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
                          v-model="register.email",
                          :class="{'input': true, 'is-danger': errors.has('email') }",
                          data-vv-as="e-mail",
                          aria-label="registration e-mail"
                        )
                  b-tile(is-child)
                    b-field
                      b-control(has-icons-left)
                        icon(icon="account")
                        b-input(
                          type="text",
                          name="displayname",
                          placeholder="Username",
                          v-validate.disable="'required|alpha_num'",
                          v-model="register.displayname"
                          :class="{'input': true, 'is-danger': errors.has('displayname') }",
                          data-vv-as="displayname",
                          aria-label="registration displayname"
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
                              v-model="register.password",
                              :class="{'input': true, 'is-danger': errors.has('password') }",
                              data-vv-as="passphrase",
                              aria-label="registration passphrase"
                            )
                      b-column
                        b-field
                          b-control(has-icons-left)
                            icon(icon="lock-plus")
                            b-input(
                              type="password",
                              name="passwordVerify",
                              placeholder="Verify passphrase",
                              v-validate.disable="'required|confirmed:password'",
                              v-model="register.passwordVerify",
                              :class="{'input': true, 'is-danger': errors.has('passwordVerify') }",
                              data-vv-as="passphrase verification",
                              aria-label="registration passphrase, again"
                            )
                  b-tile(is-parent, is-vertical, is-paddingless)
                    ouc-button(icon="account-plus").is-primary
                      p(slot="content") Register
                    notification(v-show="errors.any()", icon="alert", color="is-danger").is-danger
                      div(slot="content")
                        ul
                          li(v-for="error in errors.all()") {{error}}

    ouc-footer
</template>
