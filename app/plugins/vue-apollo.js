import nodeFetch from 'node-fetch'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import localforage from 'localforage'

import pkg from '~/../package.json'

import {ApolloClient,} from 'apollo-client'
import {HttpLink,} from 'apollo-link-http'
import {InMemoryCache,} from 'apollo-cache-inmemory'
import {CachePersistor,} from 'apollo-cache-persist'

export default async (context, inject) => {
  let api = 'https://api.openusercss.org/'

  if (context.isDev) {
    api = 'http://localhost:5000/'
  }

  const linkOptions = {
    'uri': api,
  }

  if (process.server) {
    linkOptions.fetch = nodeFetch
  }

  let persistor = null
  const httpLink = new HttpLink(linkOptions)
  const cache = new InMemoryCache()
  const clientOptions = {
    'link':              httpLink,
    'connectToDevTools': false,
    'ssrMode':           process.server,
    cache,
  }

  if (process.client) {
    persistor = new CachePersistor({
      'storage': localforage,
      cache,
    })

    const cacheVersion = localforage.getItem('ouc-cache-version')

    if (pkg.version === cacheVersion) {
      await persistor.restore()
    } else {
      await persistor.purge()
      await localforage.setItem('ouc-cache-version', pkg.version)
    }
  }

  const apolloClient = new ApolloClient(clientOptions)
  const apolloProvider = new VueApollo({
    'defaultClient': apolloClient,
    'ssr':           process.server,
  })

  Vue.use(VueApollo)
  context.app.provide = apolloProvider.provide()

  if (process.server) {
    context.beforeNuxtRender(async ({Components, nuxtState,}) => {
      Components.forEach((Component) => {
        if (Component.options && Component.options.apollo && Component.options.apollo.$init) {
          Reflect.deleteProperty(Component.options.apollo, '$init')
        }
      })
      await apolloProvider.prefetchAll(context, Components)
      nuxtState.apollo = apolloProvider.getStates()
    })
  }
}
