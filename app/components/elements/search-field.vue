<script>
  export default {
    'props': [
      'lazy',
      'value',
    ],
    mounted () {
      if (this.lazy) {
        this.$refs.main.onchange = () => {
          this.$emit('input', this.$refs.main.value)
        }
      } else {
        this.$refs.main.oninput = () => {
          this.$emit('input', this.$refs.main.value)
        }
      }
    },
    'watch': {
      value (value) {
        this.$refs.main.value = value
      },
    },
  }
</script>

<template lang="pug">
  .control.ouc-search-field.has-icons-left
    fa-icon.icon(icon="search")
    input.input(name="search", placeholder="Search themes and users", aria-label="Search themes and users", ref="main")
</template>
