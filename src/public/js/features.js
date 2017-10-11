// CSS tests
import 'browsernizr/test/css/animations'
import 'browsernizr/test/css/backdropfilter'
import 'browsernizr/test/css/backgroundrepeat'
import 'browsernizr/test/css/backgroundsize'
import 'browsernizr/test/css/backgroundsizecover'
import 'browsernizr/test/css/boxshadow'
import 'browsernizr/test/css/calc'
import 'browsernizr/test/css/checked'
import 'browsernizr/test/css/cubicbezierrange'
import 'browsernizr/test/css/filters'
import 'browsernizr/test/css/flexbox'
import 'browsernizr/test/css/flexwrap'
import 'browsernizr/test/css/fontface'
import 'browsernizr/test/css/gradients'
import 'browsernizr/test/css/lastchild'
import 'browsernizr/test/css/mediaqueries'
import 'browsernizr/test/css/nthchild'
import 'browsernizr/test/css/opacity'
import 'browsernizr/test/css/pointerevents'
import 'browsernizr/test/css/remunit'
import 'browsernizr/test/css/scrollsnappoints'
import 'browsernizr/test/css/supports'
import 'browsernizr/test/css/transforms'
import 'browsernizr/test/css/transforms3d'
import 'browsernizr/test/css/transformslevel2'
import 'browsernizr/test/css/transitions'
import 'browsernizr/test/css/userselect'

// DOM & ELEMENT TESTS
import 'browsernizr/test/dom/classlist'
import 'browsernizr/test/dom/hidden'
import 'browsernizr/test/script/async'
import 'browsernizr/test/script/defer'
import 'browsernizr/test/svg'
import 'browsernizr/test/video/autoplay'
import 'browsernizr/test/video/loop'
import 'browsernizr/test/video/preload'

// OTHER TESTS
import 'browsernizr/test/es6/promises'
import 'browsernizr/test/serviceworker'
import 'browsernizr/test/url/data-uri'

import Modernizr from 'browsernizr'
import log from 'chalk-console'
import supports from 'css-supports'
import promise from 'es6-promise'
import flexibility from 'flexibility'
import stickybits from 'stickybits'

import 'classlist-polyfill'
import 'console-polyfill'

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
  return window.CSS.supports('(position: sticky)')
})

const runPolyfills = async () => {
  const ranPolyfills = []

  if (!Modernizr.supports) {
    log.info('css/supports - support not found, shimming')
    supports.shim()
    ranPolyfills.push('supports')
  }
  if (!(Modernizr.flexbox && Modernizr.flexbox)) {
    log.info('css/flexbox - support not found, polyfilling')
    flexibility(document.documentElement)
    ranPolyfills.push('flexibility')
  }
  if (!Modernizr.promises) {
    log.info('js/promise - support not found, polyfilling')
    promise.polyfill()
    ranPolyfills.push('promises')
  }
  if (!Modernizr.stickyposition) {
    log.info('css/stickyposition not supported, polyfilling')
    stickybits('[data-c-position="sticky"]')
    ranPolyfills.push('stickyposition')
  }

  return ranPolyfills
}

module.exports = {
  runPolyfills,
  'features': Modernizr
}
