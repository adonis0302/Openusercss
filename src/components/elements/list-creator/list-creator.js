import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import bInput from '../../components/b-input/b-input.vue'
import icon from '../icon/icon.vue'

export default {
  'components': {
    'b-tile':    bulma('tile', 'div'),
    'b-button':  bulma('button', 'button'),
    'b-control': bulma('control', 'div'),
    bInput,
    icon
  },
  'props': [
    'itemName',
    'maxItems',
    'icon',
    'placeholder'
  ],
  data () {
    return {
      'list': []
    }
  },
  'watch': {
    value (newValue) {
      this.list = newValue
    }
  },
  'computed': {
    listFull () {
      return this.list.length >= this.maxItems
    }
  },
  'methods': {
    changeItem () {
      this.$emit('input', this.list)
    },
    addItem () {
      if (this.list.length < this.maxItems) {
        this.list.push('')
      }
      this.$emit('input', this.list)
    },
    removeItem (index) {
      this.list.splice(index, 1)
      this.$emit('input', this.list)
    }
  }
}
