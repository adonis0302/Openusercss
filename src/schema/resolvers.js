import allUsersQuery from './queries/all-users'
import allLoginsQuery from './queries/all-logins'
import evilSecretQuery from './queries/evil-secret'

import registerMutation from './mutations/register'
import loginMutation from './mutations/login'

export default {
  'Query': {
    'allUsers':      allUsersQuery,
    'allLogins':     allLoginsQuery,
    'getEvilSecret': evilSecretQuery
  },
  'Mutation': {
    'register': registerMutation,
    'login':    loginMutation
  }
}
