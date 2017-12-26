import verifyTokenQuery from './queries/verify-token'
import searchQuery from './queries/search'
import themeQuery from './queries/theme'
import userQuery from './queries/user'
import latestThemesQuery from './queries/latest-themes'
import versionQuery from './queries/version'

import registerMutation from './mutations/register'
import loginMutation from './mutations/login'
import logoutMutation from './mutations/logout'
import saveThemeMutation from './mutations/save-theme'
import deleteThemeMutation from './mutations/delete-theme'
import resendVerificationMutation from './mutations/resend-email-verify'
import verifyEmailMutation from './mutations/verify-email'
import accountMutation from './mutations/account'

export default {
  'Query': {
    'verifyToken':  verifyTokenQuery,
    'search':       searchQuery,
    'theme':        themeQuery,
    'user':         userQuery,
    'latestThemes': latestThemesQuery,
    'version':      versionQuery
  },
  'Mutation': {
    'register':           registerMutation,
    'login':              loginMutation,
    'logout':             logoutMutation,
    'theme':              saveThemeMutation,
    'deleteTheme':        deleteThemeMutation,
    'resendVerification': resendVerificationMutation,
    'verifyEmail':        verifyEmailMutation,
    'account':            accountMutation
  }
}
