import testQuery from './queries/test'
import verifyTokenQuery from './queries/verify-token'

import registerMutation from './mutations/register'
import loginMutation from './mutations/login'
import logoutMutation from './mutations/logout'

export default {
  'Query': {
    'verifyToken': verifyTokenQuery,
    'test':        testQuery
  },
  'Mutation': {
    'register': registerMutation,
    'login':    loginMutation,
    'logout':   logoutMutation
  }
}
