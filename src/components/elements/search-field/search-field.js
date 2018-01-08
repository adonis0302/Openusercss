import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'

import icon from '../icon/icon.vue'

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
