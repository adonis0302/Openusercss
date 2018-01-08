/* eslint-disable no-undef */
import toolbox from 'sw-toolbox'

toolbox.options.cache = {
  'name':          'ouc-assets',
  'maxAgeSeconds': 60 * 60 * 24 * 30,
}

toolbox.router.get(/^https?:\/\/localhost:312.\/.*/, toolbox.networkOnly)
toolbox.router.get(/^https?:\/\/.*$/, toolbox.cacheFirst)

addEventListener('message', (event) => {
  const {action, route,} = event.data

  if (action === 'cache-route') {
    toolbox.cache(route)
  }
})

addEventListener('install', (event) => {
  caches.delete('ouc-assets')
  toolbox.precache([
    '/',
    '/login',
    '/register',
    '/search',
    '/img/image-error-x128.png',
    '/img/main.bg-x128.png',
    '/img/openusercss.icon-x16.png',
    '/browser.js',
    '/css/bundle.min.css',
    '/manifest.json',
  ])
})
