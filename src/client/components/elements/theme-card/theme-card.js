import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import {LeftRight} from '../../../src/client/components/animations'

export default {
  'components': {
    'b-card':              bulma('card', 'div'),
    'b-card-header':       bulma('card-header', 'div'),
    'b-card-header-title': bulma('card-header-title', 'div'),
    'b-card-header-icon':  bulma('card-header-icon', 'div'),
    'b-card-image':        bulma('card-image', 'div'),
    'b-card-content':      bulma('card-content', 'div'),
    'b-card-footer':       bulma('card-footer', 'div'),
    'b-card-footer-item':  bulma('card-footer-item', 'div'),
    'b-media':             bulma('media', 'div'),
    'b-media-left':        bulma('media-left', 'div'),
    'b-media-content':     bulma('media-content', 'div'),
    'b-tile':              bulma('tile', 'div'),
    'b-box':               bulma('box', 'div'),
    icon
  },
  'methods': new LeftRight(),
  data () {
    return {
      'sideWidth': null
    }
  },
  mounted () {
    this.sideWidth = window.getComputedStyle(this.$el).width
  },
  'props': {
    'direction': {
      'type':    String,
      'default': 'vertical'
    },
    'height': {
      'type': String
    },
    'card-class': {
      'type': String
    },
    'small': {
      'type':    Boolean,
      'default': false
    },
    'tooltip': {
      'type':    String,
      'default': 'unknown'
    }
  }
}
