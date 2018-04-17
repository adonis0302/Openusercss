<script>
  export default {
    'props': [
      'lazy',
      'value',
    ],
    mounted () {
      if (this.lazy) {
        this.$el.addEventListener('change', () => {
          this.$emit('input', this.$el.value)
        })
      } else {
        this.$el.addEventListener('input', () => {
          this.$emit('input', this.$el.value)
        })
      }
    },
  }
</script>

<template lang="pug">
  textarea(:value="value").textarea.ouc-textarea
</template>
