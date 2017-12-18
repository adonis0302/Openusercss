import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const storeOptions = {
  'state': {
    'actionErrors': [],
    'session':      null,
    'loading':      false
  },
  getters,
  mutations,
  actions
}

if (process.browser) {
  const vuexLocal = new VuexPersistence({
    'storage': window.localStorage,
    'key':     'ouc-state'
  })

  storeOptions.plugins = [
    vuexLocal.plugin
  ]
}

Vue.use(Vuex)

export default new Vuex.Store(storeOptions)
