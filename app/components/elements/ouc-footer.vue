<script>
  import gql from 'graphql-tag'

  import progressiveImage from '../bits/progressive-image.vue'
  import changelog from '~/../CHANGELOG.md'

  export default {
    'apollo': {
      'version': gql`{
        version {
          revisionTag
        }
      }`,
    },
    'components': {
      progressiveImage,
    },
    'computed': {
      changelog () {
        return changelog
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
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../scss/autocolor';
  @import '../../scss/variables';

  .footer {
    padding-bottom: 48px;
  }

  .is-vertical {
    display: flex;
    flex-direction: column;
  }

  .is-primary-bg {
    background-color: nth($primary, 1);
    color: nth($primary, 2);
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
      .is-primary-bg
        .container.ouc-im-broke
          .tile.is-parent.is-paddingless
            .tile.is-child.is-pulled-left
              .box.is-primary-bg.ouc-im-broke-begging.is-borderless.is-shadowless OpenUserCSS needs your support!
            .tile.is-child
              a.button.is-patreon.is-pulled-right.is-fullheight(href="//patreon.com/DecentM", target="_blank")
                | Become a patron on
                .has-padding
                progressive-image(
                  src="/img/patreon.icon-x64.png",
                  placeholder="/img/patreon.icon-x16.png",
                  height="2",
                  width="2"
                )
              a.button.is-paypal.is-pulled-right.is-fullheight(href="//www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NQE35LHY6NKS6", target="_blank")
                | Support by PayPal!

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
            .column.has-text-right
              router-link(to="/contact")
                fa-icon(icon="envelope")
                | Contact the administrator
              p API version: {{version.revisionTag}}
              p Client version: {{$pkg.version}}&nbsp;
                a(@click.prevent="$modal.show('changelog-viewer')") (changelog)
</template>
