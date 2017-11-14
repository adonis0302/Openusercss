import toolbox from 'sw-toolbox'
import helpers from 'sw-toolbox/lib/helpers'

toolbox.options.cache = {
  'name':          'ouc',
  'maxAgeSeconds': 60 * 60 * 24 * 30
}

const indexOnly = (request, values) => {
  const cacheOptions = toolbox.options.cache || {}
  const cacheQueryOptions = cacheOptions.queryOptions || {}

  return helpers.openCache(toolbox.options)
  .then((cache) => {
    return cache.match('/', cacheQueryOptions)
    .then((response) => {
      const now = Date.now()

      if (helpers.isResponseFresh(response, cacheOptions.maxAgeSeconds, now)) {
        return response
      }

      return helpers.fetchAndCache(request, toolbox.options)
    })
  })
}

toolbox.precache([
  '/',
  '/img/image-error-x128.png',
  '/img/main.bg-x128.png',
  '/img/openusercss.icon-x16.png'
])

toolbox.router.get(/https?:\/\/.*\/(js|img|css).*/, toolbox.cacheFirst)
toolbox.router.get(/https?:\/\/localhost:312.\/.*/, toolbox.networkOnly)
toolbox.router.get(/https?:\/\/.*\/favicon.ico$/, toolbox.cacheFirst)
toolbox.router.get(/https?:\/\/gravatar.com\/avatar/, toolbox.cacheFirst)

toolbox.router.default = indexOnly
