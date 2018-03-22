import createPersistedState from 'vuex-persistedstate'

export default ({store,}) => {
  const persistState = createPersistedState({
    'key':     'ouc-state',
    'storage': window.localStorage,
  })

  return persistState(store)
}
