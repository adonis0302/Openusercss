import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import icon from '../icon/icon.vue'
import anime from 'animejs'
import {
  leftToRight
} from '../../../src/public/components/animations'

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
    'b-button':        bulma('button', 'button'),
    icon
  },
  'methods': {
    ...leftToRight,
    'toggleMenu': async (event) => {
      const burgerElement = event.target
      const targetElement = document.querySelector(`.${burgerElement.dataset.target}`)

      const isOpen = () => {
        return burgerElement.classList.contains('is-active')
      }

      burgerElement.classList.toggle('is-active')

      let node = null

      if (isOpen()) {
        node = await anime({
          'targets':    targetElement,
          'margin-top': 0,
          'duration':   500,
          'easing':     'easeOutQuart'
        })
      } else {
        node = await anime({
          'targets':    targetElement,
          'margin-top': '-400px',
          'duration':   500,
          'easing':     'easeInQuart'
        })
      }

      return node.finished
    }
  },
  'created': () => {
    setImmediate(() => {
      document.querySelector('.navbar-menu').style.marginTop = '-400px'
    })
  }
}
