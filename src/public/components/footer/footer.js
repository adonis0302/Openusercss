import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import anime from 'animejs'

export default {
  'components': {
    'b-footer':    bulma('footer', 'footer'),
    'b-container': bulma('container', 'div'),
    'b-content':   bulma('content', 'div'),
    'b-columns':   bulma('columns', 'div'),
    'b-column':    bulma('column', 'div'),
    icon
  },
  'methods': {
    'beforeAppear': async (element) => {
      element.style.opacity = 0
      element.style.transform = 'scaleY(0)'
    },
    'appear': async (element, done) => {
      const node = await anime({
        'targets':  element,
        'opacity':  1,
        'scaleY':   1,
        'duration': 1000,
        'delay':    1500,
        'easing':   'easeOutQuart'
      })

      await node.finished
      return done()
    },
    'leave': async (element, done) => {
      const node = await anime({
        'targets':  element,
        'opacity':  0,
        'scaleY':   0,
        'duration': 1000,
        'delay':    500,
        'easing':   'easeInQuart'
      })

      await node.finished
      return done()
    }
  }
}
