import {forOwn, defaultsDeep} from 'lodash'
import ApolloClient, {createBatchingNetworkInterface} from 'apollo-client'
import localStore from 'store2'

import verifyToken from './verify-token'
import logout from './remote-logout'
import login from './remote-login'

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
  verifyToken
}
