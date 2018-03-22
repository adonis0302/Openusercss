import createPersistedState from 'vuex-persistedstate'

export default ({store,}) => {
  const persistState = createPersistedState({
    'key':     'ouc-state',
    'storage': window.localStorage,
  })

  if (store.getters['session/token']) {
    store.dispatch('session/verify')
  }

  return persistState(store)
}
