import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import anime from 'animejs'

export default {
  'components': {
    'navbar':          bulma('navbar', 'nav'),
    'navbar-brand':    bulma('navbar-brand', 'div'),
    'navbar-menu':     bulma('navbar-menu', 'div'),
    'navbar-burger':   bulma('navbar-burger', 'div'),
    'navbar-start':    bulma('navbar-start', 'div'),
    'navbar-end':      bulma('navbar-end', 'div'),
    'navbar-item':     bulma('navbar-item', 'div'),
    'navbar-link':     bulma('navbar-link', 'div'),
    'navbar-dropdown': bulma('navbar-dropdown', 'div'),
    'navbar-divider':  bulma('navbar-divider', 'div'),
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
        'duration': 700,
        'delay':    2000,
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
        'duration': 700,
        'delay':    500,
        'easing':   'easeInQuart'
      })

      await node.finished
      return done()
    }
  }
}
