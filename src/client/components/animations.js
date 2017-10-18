import anime from 'animejs'

/*
 * This file houses animations as they would appear in a component's
 * `methotds` object.
 */

class Animation {
  constructor () {
    this.lengths = {
      'slow': '1s',
      'fast': '.5s'
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
  }
}

export class TopBottom extends Animation {
  constructor () {
    super()

    this.enter = async ({element, length}) => {
      // We are a newborn component

      // If we are part of a stagger list, add some delay based on our index
      const additionalDelay = element.dataset.index * 75 || 0

      // And we appear after a 500ms delay to let the guy before us go away
      const node = await anime({
        'targets':   element,
        'clip-path': 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)',
        'duration':  1000,
        'delay':     500 + additionalDelay,
        'easing':    'easeOutQuart'
      })

      // Wait for the animejs animation to finish
      await node.finished

      // After the animation is suppoed to finish, remove the clipPath property to
      // prevent unfinished animations from messing us up
      element.style.clipPath = 'none'

      return true
    }
  }
}

export const popperCreate = async (popper) => {
  const element = popper.instance.popper

  await leftRight.leftRightBeforeAppear(element)
  await leftRight.leftRightAppear(element)
}

export const topBottom = {
  'topBottomBeforeAppear': async (element) => {
    // We are a zygote component

    // Set clipPath so all our clip points are at the top
    element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% -1px, -1px -1px)'
  },
  'topBottomAppear': async (element, done) => {
    // We are a newborn component

    // If we are part of a stagger list, add some delay based on our index
    const additionalDelay = element.dataset.index * 75 || 0

    // And we appear after a 500ms delay to let the guy before us go away
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)',
      'duration':  1000,
      'delay':     500 + additionalDelay,
      'easing':    'easeOutQuart'
    })

    // Wait for the animejs animation to finish
    await node.finished

    // After the animation is suppoed to finish, remove the clipPath property to
    // prevent unfinished animations from messing us up
    element.style.clipPath = 'none'

    if (done) {
      return done()
    }
    return true
  },

  'topBottomBeforeLeave': (element) => {
    // We are a component that's about to go away

    // Set clipPath so all our clip points surround us, as our entry
    // should have made it, but just in case we got modified
    element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)'
  },
  'topBottomLeave': async (element, done) => {
    // We are a component that's going away

    // Start our exit animation, the next guy is coming in 500ms
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(-1px 101%, 101% 101%, 101% 101%, -1% 101%)',
      'duration':  500,
      'easing':    'easeInQuart'
    })

    // Wait for the animejs animation to finish
    await node.finished

    if (done) {
      return done()
    }
    return true
  }
}

export const leftRight = {
  'leftRightBeforeAppear': (element) => {
    // We are a zygote component

    // Set clipPath so all our clip points are on our left
    element.style.clipPath = 'polygon(-1px -1px, -1px -1px, -1px 101%, -1px 101%)'
  },
  'leftRightAppear': async (element, done) => {
    // We are a newborn component

    // If we are part of a stagger list, add some delay based on our index
    const additionalDelay = element.dataset.index * 75 || 0

    // And we appear after a 500ms delay to let the guy before us go away
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(-1px -1px, 101% -1px, 101% 101%, -1px 101%)',
      'duration':  1000,
      'delay':     500 + additionalDelay,
      'easing':    'easeOutQuart'
    })

    // Wait for the animejs animation to finish
    await node.finished

    // After the animation is suppoed to finish, remove the clipPath property to
    // prevent unfinished animations from messing us up
    element.style.clipPath = 'none'

    if (done) {
      return done()
    }
    return true
  },
  'leftRightBeforeLeave': (element) => {
    // We are a component that's about to go away

    // Set clipPath so all our clip points surround us, as our entry
    // should have made it, but just in case we got modified
    element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)'
  },
  'leftRightLeave': async (element, done) => {
    // We are a component that's going away

    // Start our exit animation, the next guy is coming in 500ms
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(101% -1px, 101% -1%, 101% 101%, 101% 101%)',
      'duration':  500,
      'easing':    'easeInQuart'
    })

    // Wait for the animejs animation to finish
    await node.finished

    if (done) {
      return done()
    }
    return true
  }
}
