import anime from 'animejs'

export const topToBottom = {
  'beforeAppear': async (element) => {
    element.style.clipPath = 'polygon(0 0, 100% 0%, 100% 0, 0 0)'
  },
  'appear': async (element, done) => {
    const additionalDelay = element.dataset.index * 75 || 0
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)',
      'duration':  1000,
      'delay':     2000 + additionalDelay,
      'easing':    'easeOutQuart'
    })

    await node.finished
    return done()
  },
  'leave': async (element, done) => {
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
      'duration':  1000,
      'delay':     500,
      'easing':    'easeInQuart'
    })

    await node.finished
    return done()
  }
}

export const leftToRight = {
  'beforeAppear': async (element) => {
    element.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)'
  },
  'appear': async (element, done) => {
    const additionalDelay = element.dataset.index * 75 || 0
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      'duration':  1000,
      'delay':     2000 + additionalDelay,
      'easing':    'easeOutQuart'
    })

    await node.finished
    return done()
  },
  'leave': async (element, done) => {
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
      'duration':  1000,
      'delay':     500,
      'easing':    'easeInQuart'
    })

    await node.finished
    return done()
  }
}
