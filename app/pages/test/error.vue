<script>
  export default {
    'transition': 'fade-zoom',
    beforeMount () {
      throw new Error('Manually triggered error')
    },
  }
</script>

<template lang="pug">
</template>
