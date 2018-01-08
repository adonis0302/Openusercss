import 'babel-polyfill'

import {
  forOwn,
  findIndex,
} from 'lodash'
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
      'leave':        [],
    }

    this.stage = (stageName, func, skipCheck) => {
      self.stages[stageName].push(func)
    }

    this.speeds = {
      'large': 600,
      'small': 400,
      'none':  0,
    }

    this.speed = this.speeds.large

    this.easings = {
      'leave': {
        'small': 'easeInQuad',
        'large': 'easeInQuart',
      },
      'enter': {
        'small': 'easeOutQuad',
        'large': 'easeOutQuart',
      },
      'move': {
        'small': 'easeInOutQuad',
        'large': 'easeInOutQuart',
      },
    }

    this.none = async (element, done) => {
      element.style.zIndex = 0
      await delay(this.speed)

      element.remove()
      return null
    }

    const stageAll = (func) => {
      forOwn(self.stages, (stage, key) => {
        stage.push(func)
      })
    }

    stageAll(async ({element, done,}) => {
      process.animating.push(element)
      return {element, done,}
    })

    this.finalize = () => {
      stageAll(async ({element, done,}) => {
        const animationIndex = findIndex(process.animating, (item) => item === element)

        this.speed = this.speeds.none
        if (process.browser && process.averageFps > 44) {
          this.speed = this.speeds.large
        }
        process.animating.splice(animationIndex, 1)
        return {element, done,}
      })

      forOwn(self.stages, (stage, key) => {
        self[key] = async (element, done) => {
          return waterfall(stage, {element, done,})
        }
      })
    }
  }
}

export class TopBottom extends Animation {
  constructor (interpolation) {
    super()

    this.stage('beforeAppear', async ({element, done,}) => {
      element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% -1px, -1px -1px)'

      return {element, done,}
    })

    this.stage('appear', async ({element, done,}) => {
      const additionalDelay = element.dataset.index * 75 || 0

      const node = await anime({
        'targets':   element,
        'clip-path': 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)',
        'duration':  this.speed,
        'delay':     100 + additionalDelay,
        'easing':    interpolation || 'easeInOutQuart',
      })

      await node.finished
      element.style.clipPath = 'none'

      if (done) {
        done()
      }
      return {element, done,}
    })

    this.stage('beforeLeave', async ({element, done,}) => {
      element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)'

      return {element, done,}
    })

    this.stage('leave', async ({element, done,}) => {
      const node = await anime({
        'targets':   element,
        'clip-path': 'polygon(-1px 101%, 101% 101%, 101% 101%, -1% 101%)',
        'duration':  this.speed,
        'easing':    interpolation || 'easeInOutQuart',
      })

      // Wait for the animejs animation to finish
      await node.finished

      if (done) {
        done()
      }
      return {element, done,}
    })

    this.finalize()
  }
}

export class LeftRight extends Animation {
  constructor (interpolation) {
    super()

    this.stage('beforeAppear', async ({element, done,}) => {
      element.style.clipPath = 'polygon(-1px -1px, -1px -1px, -1px 101%, -1px 101%)'

      return {element, done,}
    })

    this.stage('appear', async ({element, done,}) => {
      const additionalDelay = element.dataset.index * 75 || 0

      const node = await anime({
        'targets':   element,
        'clip-path': 'polygon(-1px -1px, 101% -1px, 101% 101%, -1px 101%)',
        'duration':  this.speed,
        'delay':     100 + additionalDelay,
        'easing':    interpolation || 'easeInOutQuart',
      })

      await node.finished
      element.style.clipPath = 'none'

      if (done) {
        done()
      }
      return {element, done,}
    })

    this.stage('beforeLeave', async ({element, done,}) => {
      element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)'

      return {element, done,}
    })

    this.stage('leave', async ({element, done,}) => {
      const node = await anime({
        'targets':   element,
        'clip-path': 'polygon(101% -1px, 101% -1%, 101% 101%, 101% 101%)',
        'duration':  this.speed,
        'easing':    interpolation || 'easeInOutQuart',
      })

      // Wait for the animejs animation to finish
      await node.finished

      if (done) {
        done()
      }
      return {element, done,}
    })

    this.finalize()
  }
}
