import allUsersQuery from './queries/all-users'
import allLoginsQuery from './queries/all-logins'
import evilSecretQuery from './queries/evil-secret'
import testQuery from './queries/test'

import registerMutation from './mutations/register'
import loginMutation from './mutations/login'

export default {
  'Query': {
    'allUsers':      allUsersQuery,
    'allLogins':     allLoginsQuery,
    'getEvilSecret': evilSecretQuery,
    'test':          testQuery
  },
  'Mutation': {
    'register': registerMutation,
    'login':    loginMutation
  }
}
