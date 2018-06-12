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
    },
    mounted () {
      this.dev = this.dev || window.location.href.includes('staging')
    },
    data () {
      return {
        'version': {},
        'dev':     process.env.NODE_ENV === 'development',
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

  .ouc-im-broke-wrapper {
    @include brand-gradient(map-get($tones, 'paypal'), map-get($tones, 'patreon'), 40%, 47.5%);
  }
</style>

<template lang="pug">
  mixin donation-button(link, text, imageSrc, imagePlaceholder, width)
    - text = text || 'Donate!'
    - width = width || '1.75rem'

    .tile.is-child
      a.button.is-fullheight.is-hidden-touch(href=link, target="_blank")&attributes(attributes)
        b #{text}
        .has-padding
        progressive-image(
          src=imageSrc,
          placeholder=imagePlaceholder,
          height="1.75rem",
          width=width,
          position="center center"
        )
      a.button.is-fullheight.is-fullwidth.is-hidden-desktop.has-padding-1(href=link, target="_blank")&attributes(attributes)
        b #{text}
        .has-padding
        progressive-image(
          src=imageSrc,
          placeholder=imagePlaceholder,
          height="1.5rem",
          width=width,
          position="center center"
        )

  div.ouc-footer-wrapper
    modal(
      name="changelog-viewer",
      height="auto",
      :scrollable="true"
    )
      .box
        div(v-html="changelog")

    .is-vertical.ouc-im-broke-wrapper
      .ouc-im-broke.is-fullheight
        .container
          .tile.is-parent.is-paddingless
            +donation-button(
              "//www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NQE35LHY6NKS6",
              "Donate through",
              "/img/paypal.icon-x64.png",
              "/img/paypal.icon-x16.png"
            ).is-paypal.is-pulled-left
            +donation-button(
              "//patreon.com/DecentM",
              "Become a patron on",
              "/img/patreon.icon-x64.png",
              "/img/patreon.icon-x16.png"
            ).is-patreon.is-pulled-right

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
            p
              | API version: {{version.revisionTag}}
            p
              | Client version: {{$pkg.version}}
              |
              a(@click.prevent="$modal.show('changelog-viewer')") (changelog)
</template>
