import anime from 'animejs'

export const topToBottom = {
  'beforeAppear': async (element) => {
    element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% -1px, -1px -1px)'
  },
  'appear': async (element, done) => {
    const additionalDelay = element.dataset.index * 75 || 0
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)',
      'duration':  1000,
      'delay':     500 + additionalDelay,
      'easing':    'easeOutQuart'
    })

    await node.finished
    return done()
  },
  'beforeLeave': (element) => {
    element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)'
  },
  'leave': async (element, done) => {
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(-1px 101%, 101% 101%, 101% 101%, -1% 101%)',
      'duration':  500,
      'easing':    'easeInQuart'
    })

    await node.finished
    return done()
  }
}

export const leftToRight = {
  'beforeAppear': (element) => {
    element.style.clipPath = 'polygon(-1px -1px, -1px -1px, -1px 101%, -1px 101%)'
  },
  'appear': async (element, done) => {
    const additionalDelay = element.dataset.index * 75 || 0
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(-1px -1px, 101% -1px, 101% 101%, -1px 101%)',
      'duration':  1000,
      'delay':     500 + additionalDelay,
      'easing':    'easeOutQuart'
    })

    await node.finished
    return done()
  },
  'beforeLeave': (element) => {
    element.style.clipPath = 'polygon(-1px -1px, 101% -1%, 101% 101%, -1% 101%)'
  },
  'leave': async (element, done) => {
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(101% -1px, 101% -1%, 101% 101%, 101% 101%)',
      'duration':  500,
      'easing':    'easeInQuart'
    })

    await node.finished
    return done()
  }
}

export const height = (heightPx) => {
  return {
    'beforeAppear': (element) => {
      element.style.height = 0
    },
    'appear': async (element, done) => {
      const additionalDelay = element.dataset.index * 75 || 0
      const node = await anime({
        'targets':  element,
        'height':   heightPx,
        'duration': 300,
        'delay':    additionalDelay,
        'easing':   'easeInOutQuart'
      })

      await node.finished
      return done()
    },
    'beforeLeave': (element) => {
      element.style.height = heightPx
    },
    'leave': async (element, done) => {
      const node = await anime({
        'targets':  element,
        'height':   0,
        'duration': 300,
        'easing':   'easeInOutQuart'
      })

      await node.finished
      return done()
    }
  }
}
