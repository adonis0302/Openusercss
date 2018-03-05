<script>
  import navbar from '../components/elements/navbar.vue'

  export default {
    'components': {
      navbar,
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
</style>

<template lang="pug">
  div.ouc-app-root
    navbar
    nuxt
</template>
