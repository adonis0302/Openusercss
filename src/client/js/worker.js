import toolbox from 'sw-toolbox'

toolbox.options.cache = {
  'name':          'ouc-assets',
  'maxAgeSeconds': 60 * 60 * 24 * 30
}

toolbox.precache([
  '/',
  '/login',
  '/register',
  '/search',
  '/img/image-error-x128.png',
  '/img/main.bg-x128.png',
  '/img/openusercss.icon-x16.png'
])

toolbox.router.get(/^https?:\/\/localhost:312.\/.*/, toolbox.networkOnly)
toolbox.router.get(/^https?:\/\/.*$/, toolbox.cacheFirst)

// eslint-disable-next-line no-undef
addEventListener('message', ({data}) => {
  const {action, route} = data

  if (action === 'cache-route') {
    toolbox.cache(route)
  }
})
