import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import profileCard from '../../elements/profile-card/profile-card.vue'
import themeCard from '../../elements/theme-card/theme-card.vue'
import flushImg from '../../elements/flush-img/flush-img.vue'

import {leftRight} from '../../../src/client/components/animations'

export default {
  'components': {
    'b-columns':     bulma('columns', 'div'),
    'b-column':      bulma('column', 'div'),
    'b-section':     bulma('section', 'div'),
    'b-box':         bulma('box', 'div'),
    'b-button':      bulma('button', 'button'),
    'b-level':       bulma('level', 'div'),
    'b-level-left':  bulma('level-left', 'div'),
    'b-level-right': bulma('level-right', 'div'),
    profileCard,
    themeCard,
    flushImg
  },
  'methods': leftRight,
  'data':    () => {
    return {
      'user': {
        'description': 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment.',
        'themes':      [
          {
            'title':         'A thing',
            'screenshotUrl': '/img/main.bg-x360.png',
            'author':        'decentm',
            'description':   'This is not really a theme, but just a test to see how cards will look when the site gets finished.'
          },
          {
            'title':         'The amazing placeholder',
            'screenshotUrl': '/img/main.bg-x360.png',
            'author':        'decentm',
            'description':   'This is not really a theme, but just a test to see how cards will look when the site gets finished.'
          },
          {
            'title':         'The theme that saves us all',
            'screenshotUrl': '/img/main.bg-x360.png',
            'author':        'decentm',
            'description':   'This is not really a theme, but just a test to see how cards will look when the site gets finished.'
          }
        ]
      }
    }
  }
}
