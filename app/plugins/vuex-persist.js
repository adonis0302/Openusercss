import createPersistedState from 'vuex-persistedstate'
import pkg from '~/../package.json'

export default ({store,}) => {
  const persistState = createPersistedState({
    'key':     `ouc-state-${pkg.version}`,
    'storage': window.localStorage,
    'paths':   [
      'session',
    ],
  })

  if (store.getters['session/token']) {
    store.dispatch('session/verify')
  }

  return persistState(store)
}
