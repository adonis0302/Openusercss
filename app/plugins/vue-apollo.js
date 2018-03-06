import 'isomorphic-fetch'
import Vue from 'vue'
import VueApollo from 'vue-apollo'

import {ApolloClient,} from 'apollo-client'
import {HttpLink,} from 'apollo-link-http'
import {InMemoryCache,} from 'apollo-cache-inmemory'

import versionQuery from '~/apollo/queries/version.gql'
import verifyTokenQuery from '~/apollo/queries/verify-token.gql'
import userQuery from '~/apollo/queries/user.gql'
import themeQuery from '~/apollo/queries/theme.gql'
import searchQuery from '~/apollo/queries/search.gql'
import popularThemesQuery from '~/apollo/queries/popular-themes.gql'
import latestThemesQuery from '~/apollo/queries/latest-themes.gql'

import verifyEmailMutation from '~/apollo/mutations/verify-email.gql'
import themeMutation from '~/apollo/mutations/theme.gql'
import resendVerificationMutation from '~/apollo/mutations/resend-verification.gql'
import registerMutation from '~/apollo/mutations/register.gql'
import rateMutation from '~/apollo/mutations/rate.gql'
import logoutMutation from '~/apollo/mutations/logout.gql'
import loginMutation from '~/apollo/mutations/login.gql'
import deleteThemeMutation from '~/apollo/mutations/delete-theme.gql'
import accountMutation from '~/apollo/mutations/account.gql'

Vue.prototype.$gql = {
  'queries': {
    'version':       versionQuery,
    'verifyToken':   verifyTokenQuery,
    'user':          userQuery,
    'theme':         themeQuery,
    'search':        searchQuery,
    'popularThemes': popularThemesQuery,
    'latestThemes':  latestThemesQuery,
  },
  'mutations': {
    'verifyEmail':        verifyEmailMutation,
    'theme':              themeMutation,
    'resendVerification': resendVerificationMutation,
    'register':           registerMutation,
    'rate':               rateMutation,
    'logout':             logoutMutation,
    'login':              loginMutation,
    'deleteTheme':        deleteThemeMutation,
    'account':            accountMutation,
  },
}

export default ({app, inDev,}, inject) => {
  let api = 'https://api.openusercss.org/'

  if (inDev) {
    api = 'http://localhost:5000/'
  }

  const httpLink = new HttpLink({
    'uri': api,
  })

  const apolloClient = new ApolloClient({
    'link':              httpLink,
    'cache':             new InMemoryCache(),
    'connectToDevTools': false,
  })

  const apolloProvider = new VueApollo({
    'defaultClient': apolloClient,
  })

  app.provide = apolloProvider.provide()
  // app.apollo = Vue.prototype.$gql.queries

  /* Vue.mixin({
    'apollo': Vue.prototype.$gql.queries,
  }) */

  Vue.use(VueApollo)
}
