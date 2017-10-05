import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import themeCard from '../../elements/theme-card/theme-card.vue'
import flushImg from '../../elements/flush-img/flush-img.vue'

export default {
  'components': {
    'b-columns': bulma('columns', 'div'),
    'b-column':  bulma('column', 'div'),
    'b-section': bulma('section', 'div'),
    themeCard,
    flushImg
  },
  'data': () => {
    return {
      'latestThemes': [
        {
          'title':         'A thing',
          'screenshotUrl': 'https://img00.deviantart.net/01da/i/2012/244/2/5/black_rock_shooter___fan_art_by_oomizuao-d5d9dju.jpg',
          'author':        'decentm',
          'description':   'This is not really a theme, but just a test to see how cards will look when the site gets finished.'
        },
        {
          'title':         'The amazing placeholder',
          'screenshotUrl': 'https://i.stack.imgur.com/7f3er.jpg',
          'author':        'decentm',
          'description':   'This is not really a theme, but just a test to see how cards will look when the site gets finished.'
        },
        {
          'title':         'Google all in pink but blue',
          'screenshotUrl': 'https://i.imgur.com/z69xJgh.png',
          'author':        'decentm',
          'description':   'This is not really a theme, but just a test to see how cards will look when the site gets finished.'
        },
        {
          'title':         'The theme that saves us all',
          'screenshotUrl': 'https://i.imgur.com/2jQju55.png',
          'author':        'decentm',
          'description':   'This is not really a theme, but just a test to see how cards will look when the site gets finished.'
        }
      ]
    }
  }
}
