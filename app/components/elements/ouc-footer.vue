<script>
  import versionQuery from '~/apollo/queries/version.gql'

  import progressiveImage from '../bits/progressive-image.vue'
  import changelog from '~/../CHANGELOG.md'

  export default {
    'apollo': {
      'version': versionQuery,
    },
    'components': {
      progressiveImage,
    },
    'computed': {
      changelog () {
        return changelog
      },
      dev () {
        return process.env.NODE_ENV === 'development'
      },
    },
    data () {
      return {
        'version': {
          'revisionTag':   'loading...',
          'latestThemes':  [],
          'popularThemes': [],
        },
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../scss/component';

  .footer {
    padding-bottom: 48px;
    color: #111;
  }

  .is-vertical {
    display: flex;
    flex-direction: column;
  }

  .ouc-im-broke-wrapper {
    @include brand-gradient(map-get($tones, 'brand-dark'), map-get($tones, 'patreon'), 40%, 42.5%);
  }

  .bg-transparent {
    background: transparent;
  }

  .is-fullheight {
    height: 100%
  }

  .patreon-logo {
    height: 100px;
    width: 100px;
  }

  .has-padding {
    padding: .25rem
  }

  .has-padding-1 {
    padding: 1rem
  }

  .v--modal .box {
    margin-top: 4rem;
  }
</style>

<template lang="pug">
  div.ouc-footer-wrapper
    modal(
      name="changelog-viewer",
      height="auto",
      :scrollable="true"
    )
      .box
        div(v-html="changelog")

    .is-vertical.ouc-im-broke-wrapper
      .container.ouc-im-broke
        .tile.is-parent.is-paddingless
          .tile.is-child.is-pulled-left
            .box.ouc-im-broke-begging.is-borderless.is-shadowless.bg-transparent.has-text-white
              | OpenUserCSS needs your support!
          .tile.is-child
            a.button.is-patreon.is-pulled-right.is-fullheight.is-hidden-touch(href="//patreon.com/DecentM", target="_blank")
              b Become a patron on
              .has-padding
              progressive-image(
                src="/img/patreon.icon-x64.png",
                placeholder="/img/patreon.icon-x16.png",
                height="1.75rem",
                width="1.75rem"
              )
            a.button.is-patreon.is-pulled-right.is-fullheight.is-fullwidth.is-hidden-desktop.has-padding-1(href="//patreon.com/DecentM", target="_blank")
              b Become a patron on
              .has-padding
              progressive-image(
                src="/img/patreon.icon-x64.png",
                placeholder="/img/patreon.icon-x16.png",
                height="1.5rem",
                width="1.5rem"
              )

      .footer.is-vertical.ouc-footer-content
        .container
          .columns
            .column.has-text-left
              .tile
                p
                  | Copyright&nbsp;&copy;&nbsp;{{new Date().getFullYear()}}&nbsp;
                  a(href="//github.com/DecentM", target="_blank") DecentM&#32;
                  | and&#32;
                  a(href="//github.com/OpenUserCSS/openusercss.org/blob/master/README.md#contributors", target="_blank") Contributors
              .tile
                p
                  a(href="//forums.openusercss.org/topic/5/privacy-policy") Privacy policy
                  | &#32;|&#32;
                  a(href="//forums.openusercss.org/topic/6/terms-of-service") Terms of service
                  | &#32;|&#32;
                  router-link(to="/notice") Notice
            .column.has-text-centered
              a(href="//github.com/OpenUserCSS", target="_blank")
                fa-icon(icon="code-branch")
                | GitHub
              div(v-if="dev")
                nuxt-link.has-text-primary(to="/test")
                  | Open test page
            .column.has-text-right
              router-link(to="/contact")
                fa-icon(icon="envelope")
                | Contact the administrator
              p API version: {{version.revisionTag}}
              p Client version: {{$pkg.version}}&nbsp;
                a(@click.prevent="$modal.show('changelog-viewer')") (changelog)
</template>
