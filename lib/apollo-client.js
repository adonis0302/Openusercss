/* eslint no-console:0 */
import {ApolloClient,} from 'apollo-client'
import {BatchHttpLink,} from 'apollo-link-batch-http'
import {onError,} from 'apollo-link-error'
import {RetryLink,} from 'apollo-link-retry'
import {InMemoryCache,} from 'apollo-cache-inmemory'
import {from,} from 'apollo-link'
import nodeFetch from 'node-fetch'
import pkg from '~/../package.json'
import apiUrl from '~/../lib/api-url'

import findError from './error-list'

// Link building
let api = null

if (process.server) {
  api = 'http://localhost:5000'
} else {
  api = apiUrl()
}

const batchLinkOptions = {
  'uri':           api,
  'batchInterval': 75,
}

if (process.server) {
  batchLinkOptions.fetch = nodeFetch
}

const httpLink = new BatchHttpLink(batchLinkOptions)
const errorLink = onError(({graphQLErrors, networkError, response = {},}) => {
  response.errors = []

  if (graphQLErrors) {
    graphQLErrors.map(({message, location, path,}) => {
      const translateError = findError(message)
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

      if (translateError) {
        returnedMessage = translateError()
      } else {
        console.error([
          `GraphQL error: ${message}`,
          `Location: ${location}`,
          `Path: ${path}`,
        ].join('\n'))

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

const authLink = (operation, forward) => {
  if (process.server) {
    return forward(operation)
  }
  const state = JSON.parse(window.localStorage.getItem(`ouc-state-${pkg.version}`))

  if (!state || !state.session || !state.session.session) {
    return forward(operation)
  }
  const {token,} = state.session.session

  operation.setContext((context) => ({
    ...context,
    'headers': {
      'Authorization': token,
    },
  }))

  return forward(operation)
}

const ssrUALink = (operation, forward) => {
  if (process.client) {
    return forward(operation)
  }

  operation.setContext((context) => ({
    ...context,
    'headers': {
      'user-agent': `openusercss-ssr/${pkg.version} (+https://github.com/OpenUserCSS/openusercss.org)`,
    },
  }))

  return forward(operation)
}

const retryLink = new RetryLink({
  'delay': {
    'initial': 350,
    'max':     1000,
    'jitter':  true,
  },
  'attempts': {
    'max':     10,
    'retryIf': (error, _operation) => !!error,
  },
})

// Client building
const cache = new InMemoryCache()
const clientOptions = {
  'link': from([
    authLink,
    ssrUALink,
    errorLink,
    retryLink,
    httpLink,
  ]),
  'connectToDevTools': false,
  'ssrMode':           process.server,
  cache,
}

export default new ApolloClient(clientOptions)
