import Vue from 'vue'
import assert from 'assert'
import QS from 'querystring'
import pify from 'pify'
import pkg from '~/../package.json'
import 'isomorphic-fetch'

const headers = {}

if (process.server) {
  headers['user-agent'] = `openusercss-ssr/${pkg.version} (+https://github.com/OpenUserCSS/openusercss.org)`
}

let api = 'https://pwk.decentm.com/index.php'

if (process.server) {
  api = 'http://pwk.decentm.com/index.php'
}

let queryQueue = []
let lockTimeout = null
let compiled = ''

const reset = () => {
  clearTimeout(lockTimeout)
  lockTimeout = null
  queryQueue = []
  compiled = ''
}

export const query = pify((userOptions = {}, thisCallback) => {
  const options = Object.assign({
    'period':     'month',
    'date':       'today',
    'module':     'API',
    'idSite':     10,
    'format':     'JSON',
    'token_auth': 'anonymous',
  }, userOptions)

  assert(
    typeof options.method === 'string',
    `"method" must be a string, got ${JSON.stringify(options.method)} (${typeof method})`
  )

  queryQueue.push({
    'queryItem': QS.stringify(options),
    'callback':  thisCallback,
  })

  if (!lockTimeout) {
    lockTimeout = setTimeout(() => {
      queryQueue.forEach(({queryItem,}, index) => {
        compiled = `${compiled}&urls[${index}]=${encodeURIComponent(queryItem)}`
      })

      const staticParams = {
        'module': 'API',
        'method': 'API.getBulkRequest',
        'format': 'JSON',
      }
      const endpoint = `${api}?${QS.stringify(staticParams)}${compiled}`

      fetch(endpoint, {
        headers,
      })
      .then((response) => response.json())
      .then((data) => {
        queryQueue.forEach(({callback,}, index,) => {
          callback(null, data[index] && data[index][0])
        })

        reset()
      })
      .catch((error) => {
        reset()
        throw error
      })
    }, 100)
  }
})

export const pageUrls = ({url,},) => {
  assert(
    typeof url === 'string',
    `The "url" argument must be a string. Got ${JSON.stringify(url)} (${typeof url}))`
  )

  return query({
    'method':  'Actions.getPageUrl',
    'pageUrl': url,
  })
}

export const themeHits = ({id,},) => {
  assert(
    typeof id === 'string',
    `The "id" argument must be a string. Got ${JSON.stringify(id)} (${typeof id}))`
  )

  return query({
    'method':  'Actions.getPageUrl',
    'pageUrl': `https://openusercss.org/theme/${id}`,
  })
}

Vue.mixin({
  'computed': {
    $stats () {
      return {
        pageUrls,
        themeHits,
      }
    },
  },
})
