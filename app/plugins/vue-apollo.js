/* eslint no-console:0 */
import nodeFetch from 'node-fetch'
import Vue from 'vue'
import VueApollo from 'vue-apollo'

import {ApolloClient,} from 'apollo-client'
import {HttpLink,} from 'apollo-link-http'
import {onError,} from 'apollo-link-error'
import {InMemoryCache,} from 'apollo-cache-inmemory'
import {from,} from 'apollo-link'

export default async (context, inject) => {
  // Link building
  let api = 'https://api.openusercss.org/'

  if (context.isDev) {
    api = 'http://localhost:5000/'
  }

  const httpLinkOptions = {
    'uri': api,
  }

  if (process.server) {
    httpLinkOptions.fetch = nodeFetch
  }

  const httpLink = new HttpLink(httpLinkOptions)
  const errorLink = onError(({graphQLErrors, networkError, response,}) => {
    response.errors = []

    if (graphQLErrors) {
      graphQLErrors.map(({message, location, path,}) => {
        console.error([
          `GraphQL error: ${message}`,
          `Location: ${location}`,
          `Path: ${path}`,
        ].join('\n'))

        const words = message.split(' ')

        // If the first word is an error code (starts with E), separate it from
        // the message by splicing it out
        let errorCode = words[0]

        if (errorCode.split('')[0] !== 'E') {
          errorCode = null
        } else {
          words.splice(0, 1)
        }

        let returnedMessage = ''

        switch (errorCode) {
        case 'E11000':
          returnedMessage = 'One or more parts of data you entered has already been used'
          break
        case 'E14031':
          returnedMessage = 'The API server has ran out of disk space'
          break
        default:
          if (errorCode) {
            returnedMessage = `Non-classified error (code: ${errorCode}): ${words.join(' ')}`
          } else {
            returnedMessage = `Non-classified error (with no error code): ${words.join(' ')}`
          }
          break
        }

        response.errors.push({
          'message': returnedMessage,
        })
      })
    }

    if (networkError) {
      console.error(`Network error: ${networkError}`)
    }
  })

  // Client building
  const cache = new InMemoryCache()
  const clientOptions = {
    'link': from([
      errorLink,
      httpLink,
    ]),
    'connectToDevTools': false,
    'ssrMode':           process.server,
    cache,
  }

  const apolloClient = new ApolloClient(clientOptions)

  // Provider building and main
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
