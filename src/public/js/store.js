import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* apolloClient.query({
  'query': gql(`{
    allUsers {
      username
      email
    }
  }`)
})
.then((result) => {
  console.log(result.data)
}) */

export const store = new Vuex.Store({
  'state': {
    'currentUser': null
  }
})
