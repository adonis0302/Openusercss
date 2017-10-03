// CSS tests
require('browsernizr/test/css/animations')
require('browsernizr/test/css/backdropfilter')
require('browsernizr/test/css/backgroundrepeat')
require('browsernizr/test/css/backgroundsize')
require('browsernizr/test/css/backgroundsizecover')
require('browsernizr/test/css/boxshadow')
require('browsernizr/test/css/calc')
require('browsernizr/test/css/checked')
require('browsernizr/test/css/cubicbezierrange')
require('browsernizr/test/css/filters')
require('browsernizr/test/css/flexbox')
require('browsernizr/test/css/flexwrap')
require('browsernizr/test/css/fontface')
require('browsernizr/test/css/gradients')
require('browsernizr/test/css/lastchild')
require('browsernizr/test/css/mediaqueries')
require('browsernizr/test/css/nthchild')
require('browsernizr/test/css/opacity')
require('browsernizr/test/css/pointerevents')
require('browsernizr/test/css/remunit')
require('browsernizr/test/css/scrollsnappoints')
require('browsernizr/test/css/supports')
require('browsernizr/test/css/transforms')
require('browsernizr/test/css/transforms3d')
require('browsernizr/test/css/transformslevel2')
require('browsernizr/test/css/transitions')
require('browsernizr/test/css/userselect')

// DOM & ELEMENT TESTS
require('browsernizr/test/dom/classlist')
require('browsernizr/test/dom/hidden')
require('browsernizr/test/script/async')
require('browsernizr/test/script/defer')
require('browsernizr/test/svg')
require('browsernizr/test/video/autoplay')
require('browsernizr/test/video/loop')
require('browsernizr/test/video/preload')

// OTHER TESTS
require('browsernizr/test/es6/promises')
require('browsernizr/test/serviceworker')
// require('browsernizr/test/url/data-uri') // FIXME: Chrome throws an error on this

const Modernizr = require('browsernizr')

require('classlist-polyfill')
require('console-polyfill')
require('../../../node_modules/scrollsnap-polyfill/dist/scrollsnap-polyfill.bundled.js')

const loglog = require('log-log')
const supports = require('css-supports')
const promise = require('es6-promise')
const flexibility = require('flexibility')

require('jarallax')

const fixed = require('sticky-header')
const stickybits = require('stickybits')
const log = loglog.create({
  'applicationName': 'cly.featuredetect'
})

// CUSTOM TESTS
Modernizr.addTest('battery', () => {
  return 'getBattery' in navigator
})
Modernizr.addTest('https', () => {
  return window.location.protocol === 'https:'
})
Modernizr.addTest('localhost', () => {
  return window.location.hostname === 'localhost'
})
if (!Modernizr.supports) {
  log.warning('css/supports - support not found, shimming')
  supports.shim()
}
Modernizr.addTest('cssgrid', () => {
  return window.CSS.supports('(display: grid)')
})
Modernizr.addTest('fixedbackground', () => {
  return window.CSS.supports('(background-attachment: fixed)')
})
Modernizr.addTest('fixedposition', () => {
  return window.CSS.supports('(position: fixed)')
})
Modernizr.addTest('stickyposition', () => {
  return window.CSS.supports('(position: sticky)') || window.CSS.supports('(position: -webkit-sticky)')
})

const runPolyfills = () => {
  return new Promise((resolve, reject) => {
    const ranPolyfills = []

    try {
      if (!(Modernizr.flexbox && Modernizr.flexbox)) {
        log.warning('css/flexbox - support not found, polyfilling')
        flexibility(document.documentElement)
        ranPolyfills.push('flexibility')
      }
      if (!Modernizr.promises) {
        log.warning('js/promise - support not found, polyfilling')
        promise.polyfill()
        ranPolyfills.push('promises')
      }
      if (!Modernizr.fixedposition) {
        log.warning('css/fixedposition not supported, polyfilling')
        fixed(document.querySelector('[data-c-position="fixed"]'))
        fixed(document.querySelector('[data-c-position="sticky"]'))
        ranPolyfills.push('fixedposition')
      }
      if (!Modernizr.stickyposition) {
        log.warning('css/stickyposition not supported, polyfilling')
        stickybits('[data-c-position="sticky"]')
        ranPolyfills.push('stickyposition')
      }
      resolve(ranPolyfills)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  runPolyfills,
  'features': Modernizr
}
