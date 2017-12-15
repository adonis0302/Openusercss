import verifyTokenQuery from './queries/verify-token'
import verifyEmailQuery from './queries/verify-email'
import searchQuery from './queries/search'
import themeQuery from './queries/theme'
import userQuery from './queries/user'
import latestThemesQuery from './queries/latest-themes'

import registerMutation from './mutations/register'
import loginMutation from './mutations/login'
import logoutMutation from './mutations/logout'
import saveThemeMutation from './mutations/save-theme'
import deleteThemeMutation from './mutations/delete-theme'

export default {
  'Query': {
    'verifyToken':  verifyTokenQuery,
    'verifyEmail':  verifyEmailQuery,
    'search':       searchQuery,
    'theme':        themeQuery,
    'user':         userQuery,
    'latestThemes': latestThemesQuery
  },
  'Mutation': {
    'register':    registerMutation,
    'login':       loginMutation,
    'logout':      logoutMutation,
    'theme':       saveThemeMutation,
    'deleteTheme': deleteThemeMutation
  }
}
