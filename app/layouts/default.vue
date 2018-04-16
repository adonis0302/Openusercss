<script>
  import navbar from '../components/elements/navbar.vue'
  import oucFooter from '../components/elements/ouc-footer.vue'

  export default {
    'components': {
      navbar,
      oucFooter,
    },
    beforeMount () {
      this.process = process
    },
    data () {
      return {
        process,
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
</style>

<template lang="pug">
  div
    navbar
    div.ouc-app-root
      nuxt
    ouc-noscript
      noscript
        .notification.is-full-centered.is-warning
          fa-icon.has-margin-right(icon="exclamation")
          p
            | You're browsing without scripts. Most features will not work, but
            | you should still be able to install themes if your extension
            | supports this.

    ouc-footer
</template>
