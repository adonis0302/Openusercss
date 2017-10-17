import 'babel-polyfill'

import log from 'chalk-console'
import anime from 'animejs'

const {XMLHttpRequest} = window

const insertScript = async (content) => {
  const script = document.createElement('script')

  script.type = 'text/javascript'
  script.innerHTML = content

  document.head.appendChild(script)

  return true
}

const showLoadingIndicator = async () => {
  const wrapper = document.querySelector('.ouc-loading-indicator-wrapper')
  const circle = document.querySelector('.ouc-loading-indicator')
  const progressbar = document.querySelector('.ouc-loading-indicator .progressbar')

  wrapper.style.height = '100vh'
  wrapper.style.display = 'flex'
  wrapper.style.justifyContent = 'center'
  wrapper.style.alignItems = 'center'

  circle.style.display = 'flex'
  circle.style.justifyContent = 'center'
  circle.style.alignItems = 'center'
  circle.style.backgroundColor = '#3E28B0'
  circle.style.borderRadius = '50%'

  progressbar.style.height = '100%'
  progressbar.style.width = '100%'
  progressbar.style.backgroundColor = '#005FFF'
  progressbar.style.borderRadius = '50%'
  progressbar.style.clipPath = 'polygon(-1px -1px, -1px -1px, -1px 101%, -1px 101%)'

  const prelude = await anime({
    'targets': '.ouc-loading-indicator',
    'easing':  'easeOutQuart',
    'delay':   200,
    'height':  [
      {'value': '0', 'duration': 700},
      {'value': '40vw', 'duration': 700}
    ],
    'width': [
      {'value': '0', 'duration': 700},
      {'value': '40vw', 'duration': 700}
    ]
  })

  await prelude.finished

  return true
}

const removeLoadingIndicator = async () => {
  const aftermath = await anime({
    'targets': '.ouc-loading-indicator',
    'easing':  'easeInQuart',
    'height':  [
      {'value': '0', 'duration': 700}
    ],
    'width': [
      {'value': '0', 'duration': 700}
    ]
  })

  await aftermath.finished

  document.querySelector('.ouc-loading-indicator-wrapper').remove()
  return true
}

const loadScript = async (url) => {
  const request = new XMLHttpRequest()
  let lastUpdate = null

  request.open('GET', url, true)
  request.send()

  request.addEventListener('progress', async (event) => {
    if (Date.now() - lastUpdate >= 300 && event.lengthComputable) {
      const percent = event.loaded / event.total * 100
      const progressbar = document.querySelector('.ouc-loading-indicator .progressbar')

      progressbar.style.transition = 'clip-path .3s'
      progressbar.style.clipPath = `polygon(-1px -1px, ${percent}% -1px, ${percent}% 101%, -1px 101%)`

      lastUpdate = Date.now()
      return true
    }
  })

  request.onreadystatechange = async () => {
    if (request.status === 200 && request.readyState === 4) {
      await removeLoadingIndicator()

      setImmediate(() => {
        insertScript(request.response)
      })
    }
  }

  return true
}

(async () => {
  showLoadingIndicator()
  await loadScript('/js/index.js')

  return true
})()
