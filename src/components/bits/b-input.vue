<script>
  export default {
    'props': [
      'lazy',
      'value',
    ],
    mounted () {
      if (this.lazy) {
        this.$el.onchange = () => {
          this.$emit('input', this.$el.value)
        }
      } else {
        this.$el.oninput = () => {
          this.$emit('input', this.$el.value)
        }
      }
    },
  }
</script>

<template lang="pug">
  input(:value="value").input.ouc-input-field
</template>
