import ApolloClient, {createBatchingNetworkInterface,} from 'apollo-client'

import verifyToken from './verify-token'
import logout from './remote-logout'
import login from './remote-login'
import register from './remote-register'
import saveTheme from './save-theme'
import deleteTheme from './delete-theme'
import getFullUser from './get-full-user'
import getFullTheme from './get-full-theme'
import getLatestThemes from './get-latest-themes'
import getPopularThemes from './get-popular-themes'
import search from './search'
import verifyEmail from './verify-email'
import sendVerify from './remote-send-verify'
import account from './account'
import rate from './rate'
import 'isomorphic-fetch'

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
  sendVerify,
  account,
  rate,
  getPopularThemes,
}
