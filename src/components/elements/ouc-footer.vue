<script>
  import icon from './icon.vue'
  import flushImg from './flush-img.vue'

  export default {
    'components': {
      icon,
      flushImg,
    },
    'computed': {
      revision () {
        if (typeof window === 'undefined') {
          return {}
        }

        return window.revision
      },
      changelog () {
        if (typeof window === 'undefined') {
          return ''
        }

        return window.changelog
      },
    },
    'methods': {
      showChangelog () {
        this.$modal.show('changelog-viewer')
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../client/scss/autocolor';
  @import '../../client/scss/variables';

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
</style>

<template lang="pug">
  div.ouc-footer-wrapper
    modal(
      name="changelog-viewer",
      height="auto",
      :scrollable="true"
    )
      .box
        vue-markdown.content(
          :source="changelog",
          :html="true",
          :anchor-attributes="$anchorAttributes"
        )

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
                flush-img(
                  source="/img/patreon.icon-x64.png",
                  placeholder="/img/patreon.icon-x16.png",
                  height="25px",
                  width="25px"
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
                icon(icon="github-circle")
                | GitHub
            .column.has-text-right
              router-link(to="/contact")
                icon(icon="email-variant")
                | Contact the administrator
              p Client version: {{revision.revisionTag}}&nbsp;
                a(@click.prevent="showChangelog") (changelog)
</template>
