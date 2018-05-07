<script>
  import navbar from '../components/elements/navbar.vue'
  import oucFooter from '../components/elements/ouc-footer.vue'

  export default {
    'components': {
      navbar,
      oucFooter,
    },
    mounted () {
      this.staging = process.env.OUC_STAGING === 'true'
        || window.location.href.includes('staging')
    },
    data () {
      return {
        'staging': false,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .spacer {
    width: 1rem;
  }

  .is-full-centered {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .has-margin-right {
    margin-right: .75rem;
  }

  .has-small-padding {
    padding: 8px;
  }
</style>

<template lang="pug">
  .ouc-ancestor
    navbar
    .ouc-app-root
      .notification.is-warning.has-small-padding.is-marginless.has-text-centered.ouc-staging-warning(v-if="staging")
        p
          fa-icon(icon="exclamation")
          | You're viewing the staging version of OpenUserCSS. Please test the
          | app and report bugs on GitHub, but any or all data here may be deleted
          | permanently without notice.
      nuxt

    div
      ouc-footer
      ouc-noscript
        noscript
          .notification.is-full-centered.is-warning
            fa-icon.has-margin-right(icon="exclamation")
            p
              | You're browsing without scripts. Most features will not work, but
              | you should still be able to install themes if your extension
              | supports this.
</template>
