import 'isomorphic-fetch'
import ApolloClient, {createBatchingNetworkInterface,} from 'apollo-client'

import verifyToken from './actions/verify-token'
import logout from './actions/remote-logout'
import login from './actions/remote-login'
import register from './actions/remote-register'
import saveTheme from './actions/save-theme'
import deleteTheme from './actions/delete-theme'
import getFullUser from './actions/get-full-user'
import getFullTheme from './actions/get-full-theme'
import getLatestThemes from './actions/get-latest-themes'
import getPopularThemes from './actions/get-popular-themes'
import search from './actions/search'
import verifyEmail from './actions/verify-email'
import sendVerify from './actions/remote-send-verify'
import account from './actions/account'
import rate from './actions/rate'

const ssrMode = process.title === 'node'
const inDev = process.env.NODE_ENV === 'development'
let networkInterface = null
let apiURI = 'https://api.openusercss.org'

if (inDev) {
  apiURI = 'http://localhost:5000'
}

networkInterface = createBatchingNetworkInterface({
  'uri': apiURI,
})

export const apolloClient = new ApolloClient({
  'cache':              false,
  'queryDeduplication': true,
  ssrMode,
  networkInterface,
})

export const actions = {
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
  sendVerify,
  account,
  rate,
  getPopularThemes,
}
