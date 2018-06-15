<script>
  import {forOwn, cloneDeep,} from 'lodash'
  import {mapGetters,} from 'vuex'
  import parseUA from 'ua-parser-js'

  import spinner from '~/components/elements/spinner.vue'
  import notification from '~/components/elements/notification.vue'
  import oucButton from '~/components/elements/ouc-button.vue'

  import bInput from '~/components/bits/b-input.vue'
  import bTextarea from '~/components/bits/b-textarea.vue'
  import bSwitch from '~/components/bits/b-switch.vue'

  import sessionsQuery from '~/apollo/queries/sessions.gql'

  export default {
    'transition': 'fade-zoom',
    'components': {
      spinner,
      notification,
      bInput,
      oucButton,
      bTextarea,
      bSwitch,
    },
    data () {
      return {
        'sessions': [],
        'email':    '',
        'account':  {
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
          'sessions':    null,
        },
        'viewingSessions': null,
        'sessionsFilter':  '',
      }
    },
    'apollo': {
      'sessions': sessionsQuery,
    },
    created () {
      this.account = cloneDeep(this.viewerUser)
    },
    'methods': {
      parseUA,
      async resendVerification () {
        try {
          await this.$store.dispatch('account/resendVerify')
          this.$toast.success('Check your inbox!', 'Sent')
        } catch (error) {
          this.$toast.error(error.message, 'Error')
        }
      },
      async submitAccount () {
        const validated = await this.$validator.validateAll()

        if (validated) {
          const puts = []

          Object.keys(this.editing).forEach((key) => {
            if (this.editing[key] === 'on') {
              puts.push(this.$store.dispatch('account/submit', {
                [key]: this.account[key] || '',
              }))
            }
          })

          return Promise.all(puts)
          .then(() => {
            this.$toast.success('Your account details have been saved successfully', 'Saved')
            this.$router.push(`/profile/${this.viewer._id}`)
          })
          .catch((error) => {
            this.$toast.error(error.message, 'Error')
          })
        }
      },
    },
    'computed': {
      ...mapGetters({
        'loading': 'account/loading',
      }),
      viewerUser () {
        let id = null

        if (this.viewer) {
          id = this.viewer._id
        }

        return this.$store.getters['users/single'](id)
      },
      viewer () {
        return this.$store.getters['session/viewer']
      },
      token () {
        return this.$store.getters['session/token']
      },
      viewerSession () {
        return this.$store.getters['session/data']
      },
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
  @import '../../scss/component';

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
      .level.is-mobile
        .level-left
          h5 #{title}
        .level-right
          label
            fa-icon(v-if=condition, icon="lock", color="#DBDBDB")
            fa-icon(v-else=condition, icon="unlock", color="#ACACAC")
            b-switch(v-model=model)
      if block
        block

  div.ouc-route-root
    .container.ouc-account-wrapper
      .section
        div.ouc-logged-out(v-show="!viewer")
          p
            | This page allows you to edit account details,
            | but you're not logged in.
          br
          p
            nuxt-link.button.is-brand-primary(to="/login") Click here to do so

        no-ssr
          form.ouc-logged-in(v-if="viewer", @submit.prevent="submitAccount")
            .tile.is-parent.is-paddingless
              .tile.is-child
                transition(name="fade-zoom")
                  .notification.is-danger(v-if="editingCount && errors.any()")
                    | {{errors.all()[0]}}
                button.button.is-brand-primary.is-pulled-right(
                  type="submit",
                  :disabled="!this.editingCount",
                  :class="{'is-loading': loading}"
                ) Save unlocked account details

            br
            .columns
              .column.is-6
                .content
                  h3 Account details

                hr

                .box
                  .level
                    .level-left
                      h5 Active sessions ({{sessions.length}})
                    .level-right
                      label
                        | Show
                        |
                        b-switch(v-model="viewingSessions")

                  transition(name="crop")
                    .tile.is-parent.is-vertical.is-paddingless(v-if="viewingSessions")
                      input.input(v-model="sessionsFilter", placeholder="Filter sessions")
                      br(v-if="filterBy(sessions, sessionsFilter).length")
                      .tile(v-for="session in filterBy(sessions, sessionsFilter)")
                        .tile.is-child
                          .card
                            .card-header
                              .card-header-title.level.is-brand-primary.is-mobile
                                p.level-left(v-if="parseUA(session.ua).browser.name"
                                                + "&& parseUA(session.ua).os.name")
                                  | {{parseUA(session.ua).browser.name}}
                                  | on {{parseUA(session.ua).os.name}}
                                p.level-left(v-else)
                                  | Unknown device
                                p.level-right(v-if="viewerSession._id === session._id")
                                  | (this session)
                            .card-content.is-paddingless
                              table.table.is-fullwidth.is-marginless.is-striped.is-hoverable
                                tbody
                                  tr
                                    td IP address:
                                    td {{session.ip}}
                                  tr(v-if="parseUA(session.ua).browser.name"
                                        + "&& parseUA(session.ua).browser.major")
                                    td Browser:
                                    td
                                      | {{parseUA(session.ua).browser.name}}
                                      | {{parseUA(session.ua).browser.major}}
                                  tr(v-if="parseUA(session.ua).os.name")
                                    td OS:
                                    td
                                      | {{parseUA(session.ua).os.name}}
                                      | {{parseUA(session.ua).os.version}}
                                  tr(v-if="!parseUA(session.ua).browser.name"
                                        + "|| !parseUA(session.ua).os.name")
                                    td User agent:
                                    td {{session.ua}}
                                  tr
                                    td Created:
                                    td {{session.createdAt | moment('MMMM Do, YYYY HH:mm')}}
                                  tr
                                    td Expires:
                                    td {{session.expiresAt | moment('MMMM Do, YYYY HH:mm')}}
                          br

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
                            autocomplete="email",
                            v-model="account.email",
                            :disabled="!editing.email",
                            placeholder="E-mail address"
                            v-validate.lazy="'required|email'",
                            :class="{'is-danger': errors.has('email') && editing.email}",
                          )
                    br
                    .tile
                      .tile.is-child
                        button.button.is-brand-primary(
                          type="button",
                          :class="{'is-loading': loading}",
                          @click="resendVerification",
                          :disabled="!editing.email"
                        )
                          | Resend verification e-mail

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
                          autocomplete="new-password",
                          v-model="account.password",
                          :disabled="!editing.password",
                          placeholder="Passphrase",
                          v-validate.lazy="'required'",
                          :class="{'is-danger': errors.has('password') && editing.password}",
                          data-vv-as="passphrase",
                          aria-label="registration passphrase"
                        )
                      br
                      .control
                        b-input(
                          name="passwordVerify",
                          type="password",
                          autocomplete="new-password",
                          v-model="account.passwordVerify",
                          :disabled="!editing.password",
                          placeholder="Passphrase verification",
                          v-validate.lazy="'required|confirmed:password'",
                          :class="{'is-danger': errors.has('passwordVerify') && editing.password}",
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
                          b-input(:value="viewer.donationUrl", disabled)
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
                          b-input(:value="viewer.displayname", disabled)
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
                            v-validate.lazy="'required|max:32'",
                            :class="{'is-danger': errors.has('displayname') && editing.displayname}"
                            data-vv-as="username"
                          )

                +account-card("!editing.bio", "editing.bio", "Bio")
                  .control
                    b-textarea(
                      name="bio",
                      v-model="account.bio",
                      :disabled="!editing.bio",
                      placeholder="Write something about yourself!",
                      v-validate.lazy="'required'",
                      :class="{'is-danger': errors.has('bio') && editing.bio}"
                    )

                  br
                  .box(:disabled="!editing.bio")
                    .content
                      vue-markdown(
                        :source="account.bio",
                        :html="false",
                        :anchor-attributes="$anchorAttributes"
                      )
</template>
