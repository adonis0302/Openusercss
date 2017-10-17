import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import profileCard from '../../elements/profile-card/profile-card.vue'
import flushImg from '../../elements/flush-img/flush-img.vue'

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
    flushImg
  },
  'data': () => {
    return {
      'latestThemes': [
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
