<script>
  import {mapGetters,} from 'vuex'
  import {forOwn,} from 'lodash'

  import spinner from '../elements/spinner.vue'
  import oucFooter from '../elements/ouc-footer.vue'
  import notification from '../elements/notification.vue'
  import oucButton from '../elements/ouc-button.vue'
  import icon from '../elements/icon.vue'

  import bInput from '../bits/b-input.vue'
  import bTextarea from '../bits/b-textarea.vue'
  import bSwitch from '../bits/b-switch.vue'

  export default {
    'components': {
      oucFooter,
      spinner,
      notification,
      bInput,
      oucButton,
      bTextarea,
      bSwitch,
      icon,
    },
    data () {
      return {
        'email':   '',
        'account': {
          'email':       '',
          'password':    '',
          'displayname': '',
          'bio':         '',
          'donationUrl': 'https://',
        },
        'editing': {
          'email':       null,
          'password':    null,
          'displayname': null,
          'bio':         null,
          'donationUrl': null,
        },
      }
    },
    async beforeMount () {
      if (this.session.user) {
        const user = await this.$store.dispatch('getFullUser', this.session.user._id)

        this.account.bio = user.bio
      }
    },
    'methods': {
      async resendVerification () {
        const {data,} = await this.$store.dispatch('sendVerify', this.session.token)
        const {resendVerification,} = data

        if (resendVerification) {
          this.$toast.success({
            'title':   'Sent',
            'message': 'Check your inbox!',
            'theme':   'ouc',
            'layout':  2,
          })
        }
      },
      async submitAccount () {
        const validated = await this.$validator.validateAll()
        const self = this

        if (validated) {
          forOwn(this.editing, (value, key) => {
            if (value) {
              this.$store.dispatch('account', {
                'accountData': {
                  [key]: self.account[key] || '',
                },
                'redirect': `/profile/${this.currentUser._id}`,
              })
            }
          })
        }
      },
    },
    'computed': {
      ...mapGetters([
        'currentUser',
        'session',
        'actionErrors',
        'loading',
      ]),
      editingCount () {
        let result = 0

        forOwn(this.editing, (value, key) => {
          if (value) {
            result = result + 1
          }
        })

        return result
      },
    },
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

  .box {
    &[disabled] {
      background-color: $white-bis
    }
  }
</style>

<template lang="pug">
  mixin account-card(condition, model, title)
    .box.ouc-account-card(:disabled=condition)
      .level
        .level-left
          h5 #{title}
        .level-right
          label
            icon(v-if=condition, icon="lock")
            icon(v-else=condition, icon="lock-open-outline")
            b-switch(v-model=model)
      if block
        block

  div.ouc-route-root
    .container.ouc-account-wrapper
      .section
        div.ouc-logged-out(v-if="!currentUser._id")
          p
            | This page allows you to edit account details,
            | but you're not logged in.
          br
          p
            router-link.button.is-primary(to="/login") Click here to do so

        form.ouc-logged-in(v-else="!currentUser._id", @submit.prevent="submitAccount")
          .tile.is-parent.is-paddingless
            .tile.is-child
              button.button.is-primary.is-pulled-right(
                type="submit",
                :disabled="this.editingCount === 0",
                :class="{'is-loading': loading}"
              ) Save unlocked account details

          br
          .columns
            .column.is-6
              .content
                h3 Account details

              hr
              +account-card("!editing.email", "editing.email", "E-mail address")
                .tile.is-parent.is-vertical.is-paddingless
                  .tile
                    .tile.is-child.is-3
                      .content
                        p Change to
                    .tile.is-child.is-9
                      .control
                        b-input(
                          name="email",
                          v-model="account.email",
                          :disabled="!editing.email",
                          placeholder="E-mail address"
                          v-validate.disable="'required|email'",
                          :class="{'is-danger': errors.has('email')}",
                        )
                  br
                  .tile
                    .tile.is-child
                      button.button.is-primary(
                        type="button",
                        :class="{'is-loading': loading}",
                        @click="resendVerification",
                        :disabled="!editing.email"
                      )
                        | Resend verification e-mail to the current address

              +account-card("!editing.password", "editing.password", "Passphrase")
                .tile.is-parent.is-vertical.is-paddingless
                  .tile.is-child
                    .content
                      p Change to
                  .tile.is-child
                    .control
                      b-input(
                        name="password",
                        type="password",
                        v-model="account.password",
                        :disabled="!editing.password",
                        placeholder="Passphrase",
                        v-validate.disable="'required'",
                        :class="{'is-danger': errors.has('password')}",
                        data-vv-as="passphrase",
                        aria-label="registration passphrase"
                      )
                    br
                    .control
                      b-input(
                        name="passwordVerify",
                        type="password",
                        v-model="account.passwordVerify",
                        :disabled="!editing.password",
                        placeholder="Passphrase verification",
                        v-validate.disable="'required|confirmed:password'",
                        :class="{'is-danger': errors.has('passwordVerify')}",
                        data-vv-as="passphrase verification",
                        aria-label="registration passphrase again"
                      )

            .column(is-6)
              .content
                h3 Profile settings
              hr
              +account-card("!editing.donationUrl", "editing.donationUrl", "Donation link")
                .tile.is-parent.is-vertical.is-paddingless
                  .tile
                    .tile.is-child.is-3
                      .content
                        p Currently
                    .tile.is-child.is-9
                      .control
                        b-input(:value="currentUser.donationUrl", disabled)
                  br
                  .tile
                    .tile.is-child.is-3
                      .content
                        p Change to
                    .tile.is-child.is-9
                      .control
                        b-input(v-model="account.donationUrl", :disabled="!editing.donationUrl")

              +account-card("!editing.displayname", "editing.displayname", "Username")
                .tile.is-parent.is-vertical.is-paddingless
                  .tile
                    .tile.is-child.is-3
                      .content
                        p Currently
                    .tile.is-child.is-9
                      .control
                        b-input(:value="currentUser.displayname", disabled)
                  br
                  .tile
                    .tile.is-child.is-3
                      .content
                        p Change to
                    .tile.is-child.is-9
                      .control
                        b-input(
                          name="displayname"
                          v-model="account.displayname",
                          :disabled="!editing.displayname"
                          placeholder="Username",
                          v-validate.disable="'required|alpha_num'",
                          :class="{'is-danger': errors.has('displayname')}"
                        )

              +account-card("!editing.bio", "editing.bio", "Bio")
                .control
                  b-textarea(
                    name="bio",
                    v-model="account.bio",
                    :disabled="!editing.bio",
                    placeholder="Write something about yourself!",
                    v-validate.disable="'required'",
                    :class="{'is-danger': errors.has('bio')}"
                  )

                br
                .box(:disabled="!editing.bio")
                  .content
                    vue-markdown(
                      :source="account.bio",
                      :html="false",
                      :anchor-attributes="$anchorAttributes"
                    )

    ouc-footer
</template>
