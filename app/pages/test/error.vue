<script>
  export default {
    'transition': 'fade',
    beforeMount () {
      throw new Error('Manually triggered error')
    },
  }
</script>

<template lang="pug">
</template>
