import ApolloClient, {createBatchingNetworkInterface} from 'apollo-client'

import verifyToken from './verify-token'
import logout from './remote-logout'
import login from './remote-login'
import register from './remote-register'
import saveTheme from './save-theme'
import deleteTheme from './delete-theme'
import getThemes from './get-themes'
import getFullUser from './get-full-user'
import getFullTheme from './get-full-theme'
import getLatestThemes from './get-latest-themes'

let networkInterface = createBatchingNetworkInterface({
  'uri': 'https://api.openusercss.org'
})

if (process.env.NODE_ENV === 'development') {
  networkInterface = createBatchingNetworkInterface({
    'uri': 'http://localhost:5000'
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
  getThemes,
  getFullUser,
  getFullTheme,
  getLatestThemes
}
