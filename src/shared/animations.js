import 'babel-polyfill'

import {forOwn} from 'lodash'
import anime from 'animejs'
import waterfall from 'p-waterfall'
import delay from 'delay'

/*
 * This file houses animations as they would appear in a component's
 * `methods` object.
 */

class Animation {
  constructor () {
    const self = this

    this.stack = []

    this.stages = {
      'beforeAppear': [],
      'appear':       [],
      'beforeLeave':  [],
      'leave':        []
    }

    this.stage = (stageName, func) => {
      this.stages[stageName].push(func)
    }

    this.speeds = {
      'slow': 700,
      'fast': 400
    }

    this.easings = {
      'leave': {
        'small': 'easeInQuad',
        'large': 'easeInQuart'
      },
      'enter': {
        'small': 'easeOutQuad',
        'large': 'easeOutQuart'
      },
      'move': {
        'small': 'easeInOutQuad',
        'large': 'easeInOutQuart'
      }
    }

    this.none = async (element, done) => {
      element.style.zIndex = 0
      await delay(element.dataset.speed)

      element.remove()
      return null
    }

    this.finalize = () => {
      forOwn(self.stages, (stage, key) => {
        self[key] = async (element, done) => {
          element.dataset.speed = this.speeds.slow
          if (process.browser) {
            if (process.fps < 40) {
              element.dataset.speed = 0
            }
          }

          return waterfall(stage, {element, done})
        }
      })
    }
  }
}

export class TopBottom extends Animation {
  constructor () {
    super()

    this.stage('beforeAppear', async ({element}) => {
      element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% -1px, -1px -1px)'

      return element
    })

    this.stage('appear', async ({element, done}) => {
      const additionalDelay = element.dataset.index * 75 || 0

      const node = await anime({
        'targets':   element,
        'clip-path': 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)',
        'duration':  element.dataset.speed,
        'delay':     100 + additionalDelay,
        'easing':    'easeInOutQuart'
      })

      await node.finished
      element.style.clipPath = 'none'

      if (done) {
        done()
      }
      return element
    })

    this.stage('beforeLeave', async ({element}) => {
      element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)'

      return element
    })

    this.stage('leave', async ({element, done}) => {
      const node = await anime({
        'targets':   element,
        'clip-path': 'polygon(-1px 101%, 101% 101%, 101% 101%, -1% 101%)',
        'duration':  element.dataset.speed,
        'easing':    'easeInOutQuart'
      })

      // Wait for the animejs animation to finish
      await node.finished

      if (done) {
        done()
      }
      return element
    })

    this.finalize()
  }
}

export class LeftRight extends Animation {
  constructor () {
    super()

    this.stage('beforeAppear', async ({element}) => {
      element.style.clipPath = 'polygon(-1px -1px, -1px -1px, -1px 101%, -1px 101%)'

      return element
    })

    this.stage('appear', async ({element, done}) => {
      const additionalDelay = element.dataset.index * 75 || 0

      const node = await anime({
        'targets':   element,
        'clip-path': 'polygon(-1px -1px, 101% -1px, 101% 101%, -1px 101%)',
        'duration':  element.dataset.speed,
        'delay':     100 + additionalDelay,
        'easing':    'easeInOutQuart'
      })

      await node.finished
      element.style.clipPath = 'none'

      if (done) {
        done()
      }
      return element
    })

    this.stage('beforeLeave', async ({element}) => {
      element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)'

      return element
    })

    this.stage('leave', async ({element, done}) => {
      const node = await anime({
        'targets':   element,
        'clip-path': 'polygon(101% -1px, 101% -1%, 101% 101%, 101% 101%)',
        'duration':  element.dataset.speed,
        'easing':    'easeInOutQuart'
      })

      // Wait for the animejs animation to finish
      await node.finished

      if (done) {
        done()
      }
      return element
    })

    this.finalize()
  }
}
