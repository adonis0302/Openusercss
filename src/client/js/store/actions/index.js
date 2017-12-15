import ApolloClient, {createBatchingNetworkInterface} from 'apollo-client'

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

let networkInterface = createBatchingNetworkInterface({
  'uri': 'http://localhost:5000'
})

if (process.browser && window.location.protocol === 'https:') {
  networkInterface = createBatchingNetworkInterface({
    'uri': 'https://localhost:5001'
  })
}

if (process.browser && window.location.host.match(/openusercss/g)) {
  networkInterface = createBatchingNetworkInterface({
    'uri': 'https://api.openusercss.org'
  })
}

export const apolloClient = new ApolloClient({
  networkInterface
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
  sendVerify
}
