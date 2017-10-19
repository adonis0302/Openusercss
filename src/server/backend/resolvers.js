import verifyTokenQuery from './queries/verify-token'
import searchQuery from './queries/search'
import themeQuery from './queries/theme'
import userQuery from './queries/user'
import latestThemesQuery from './queries/latest-themes'

import registerMutation from './mutations/register'
import loginMutation from './mutations/login'
import logoutMutation from './mutations/logout'
import createThemeMutation from './mutations/create-theme'

export default {
  'Query': {
    'verifyToken':  verifyTokenQuery,
    'search':       searchQuery,
    'theme':        themeQuery,
    'user':         userQuery,
    'latestThemes': latestThemesQuery
  },
  'Mutation': {
    'register': registerMutation,
    'login':    loginMutation,
    'logout':   logoutMutation,
    'theme':    createThemeMutation
  }
}
