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
      'delay':     2000 + additionalDelay,
      'easing':    'easeOutQuart'
    })

    await node.finished
    return done()
  },
  'leave': async (element, done) => {
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(-1px 101%, 101% 101%, 101% 101%, -1% 101%)',
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
    element.style.clipPath = 'polygon(-1px -1px, -1px -1px, -1px 101%, -1px 101%)'
  },
  'appear': async (element, done) => {
    const additionalDelay = element.dataset.index * 75 || 0
    const node = await anime({
      'targets':   element,
      'clip-path': 'polygon(-1px -1px, 101% -1px, 101% 101%, -1px 101%)',
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
      'clip-path': 'polygon(101% 0, 101% 0, 101% 101%, 101% 101%)',
      'duration':  1000,
      'delay':     500,
      'easing':    'easeInQuart'
    })

    await node.finished
    return done()
  }
}
