import ApolloClient, {createBatchingNetworkInterface} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'

import verifyToken from './verify-token'
import logout from './remote-logout'
import login from './remote-login'
import register from './remote-register'
import saveTheme from './save-theme'
import deleteTheme from './delete-theme'
import getFullUser from './get-full-user'
import getFullTheme from './get-full-theme'
import getLatestThemes from './get-latest-themes'
import search from './search'
import verifyEmail from './verify-email'
import sendVerify from './remote-send-verify'
import 'isomorphic-fetch'

const ssrMode = process.title === 'node'
const inDev = process.env.NODE_ENV === 'development'
let networkInterface = null
let apolloClient = null

if (!ssrMode && inDev) {
  networkInterface = createBatchingNetworkInterface({
    'uri': 'http://localhost:5000'
  })

  apolloClient = new ApolloClient({
    networkInterface
  })
}

if (!ssrMode && !inDev) {
  networkInterface = createBatchingNetworkInterface({
    'uri': 'https://api.openusercss.org'
  })

  apolloClient = new ApolloClient({
    networkInterface
  })
}

if (ssrMode && inDev) {
  networkInterface = createBatchingNetworkInterface({
    'uri': 'http://localhost:5000'
  })

  apolloClient = new ApolloClient({
    'cache': false,
    'link':  createHttpLink({
      'uri': 'http://localhost:5000'
    }),
    ssrMode,
    networkInterface
  })
}

if (ssrMode && !inDev) {
  networkInterface = createBatchingNetworkInterface({
    'uri': 'https://api.openusercss.org'
  })

  apolloClient = new ApolloClient({
    'cache': false,
    'link':  createHttpLink({
      'uri': 'https://api.openusercss.org'
    }),
    ssrMode,
    networkInterface
  })
}

export {apolloClient}
export default {
  logout,
  login,
  register,
  verifyToken,
  saveTheme,
  deleteTheme,
  getFullUser,
  getFullTheme,
  getLatestThemes,
  search,
  verifyEmail,
  sendVerify
}
