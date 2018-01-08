<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import icon from './icon.vue'

  export default {
    'props': [
      'lazy',
      'value',
    ],
    'components': {
      'b-field':   bulma('field', 'div'),
      'b-label':   bulma('label', 'label'),
      'b-control': bulma('control', 'div'),
      icon,
    },
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
  b-control(has-icons-left)
    icon(icon="magnify")
    input.input(name="search", placeholder="Search themes and users", aria-label="Search themes and users", ref="main")
</template>
