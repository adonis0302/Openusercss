import testQuery from './queries/test'
import verifyTokenQuery from './queries/verify-token'
import searchQuery from './queries/search'

import registerMutation from './mutations/register'
import loginMutation from './mutations/login'
import logoutMutation from './mutations/logout'
import createThemeMutation from './mutations/create-theme'

export default {
  'Query': {
    'verifyToken': verifyTokenQuery,
    'test':        testQuery,
    'search':      searchQuery
  },
  'Mutation': {
    'register':    registerMutation,
    'login':       loginMutation,
    'logout':      logoutMutation,
    'createTheme': createThemeMutation
  }
}
