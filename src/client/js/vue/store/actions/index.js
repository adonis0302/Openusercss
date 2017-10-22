import {forOwn, defaultsDeep} from 'lodash'
import ApolloClient, {createBatchingNetworkInterface, createNetworkInterface} from 'apollo-client'
import localStore from 'store2'

import verifyToken from './verify-token'
import logout from './remote-logout'
import login from './remote-login'
import register from './remote-register'
import createTheme from './create-theme'
import getThemes from './get-themes'
import getFullUser from './get-full-user'

const networkInterface = createBatchingNetworkInterface({
  'uri': '/graphql'
})

export const apolloClient = new ApolloClient({
  networkInterface
})

export default {
  async updateFormData (context, data) {
    let formData = {}

    forOwn(data, (event, key) => {
      if (event.srcElement) {
        formData = defaultsDeep({
          [event.srcElement.name]: event.target.value
        }, formData)
        context.commit('updateFormData', formData)
      }
    })
  },

  async getOfflineToken (context) {
    context.commit('login', {
      'data': {
        'login': localStore.get('session')
      }
    })
  },

  logout,
  login,
  register,
  verifyToken,
  createTheme,
  getThemes,
  getFullUser
}
