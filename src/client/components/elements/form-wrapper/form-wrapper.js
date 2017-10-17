import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import {topBottom} from '../../../src/client/components/animations'

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
    icon
  },
  'methods': {
    ...topBottom
  }
}
