import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export const store = new Vuex.Store({
  'state': {
    'currentUser':  null,
    'latestThemes': [],
    'formData':     [],
    'testText':     '',
    'loginError':   '',
    'token':        null
  },
  getters,
  mutations,
  actions
})
