<script>
  import {mapGetters,} from 'vuex'

  export default {
    fetch ({store, route,}) {
      return store.dispatch('licenses/all')
    },
    data () {
      return {
        'viewingIndex': null,
      }
    },
    'computed': mapGetters({
      'licenses': 'licenses/all',
    }),
    'methods': {
      open (index) {
        this.viewingIndex = index
        this.$modal.show('license-viewer')
      },
      find (index) {
        const found = this.licenses.find((license, licenseIndex) => {
          return licenseIndex === index
        })

        if (!found) {
          return ''
        }

        return found.sourceText
      },
    },
  }
</script>

<style lang="scss">
  @import '../../scss/component';

  .bg-primary {
    background-color: nth($primary, 1) !important;
    color: nth($primary, 2) !important;
  }

  pre {
    font-family: monospace;
    white-space: pre-wrap;
  }

  .navbar-offset {
    margin-top: map-get($kerning, 'navbar-height');
  }

  a {
    border: none !important;
  }
</style>

<template lang="pug">
  div.ouc-route-root
    modal(
      name="license-viewer",
      height="auto",
      :scrollable="true",
      width="700px"
    )
      .tile.is-parent.is-paddingless.navbar-offset
        .tile.is-child
          pre {{find(viewingIndex)}}

    .container
      .section
        .content
          h1 Open Source licenses
          h5
            | OpenUserCSS uses open source packages provided by the awesome
            | developer community.
            br
            | This page lists non-permissively licensed packages.&nbsp;
            a(
              href="//github.com/OpenUserCSS/openusercss.org",
              target="_blank"
            ) Check out all packages on our GitHub page here.

          hr

          .columns.is-multiline
            .column.is-4(v-for="(license, index) in licenses")
              .box.bg-primary
                p(v-if="!license.repository") {{license.package}}
                a.bg-primary(
                  v-if="license.repository",
                  :href="license.repository",
                  rel="noopener nofollow",
                  target="_blank"
                ) {{license.package}}
                hr
                .level
                  .level-left
                    p
                      | License:
                      br
                      | {{license.license}}
                  .level-right(v-if="license.sourceText")
                    button.button.is-brand-secondary.is-borderless(@click.prevent="open(index)")
                      | View full license text
                  .level-right(v-if="!license.sourceText && license.source")
                    p Source: {{license.source}}
</template>
