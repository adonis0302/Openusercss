export default {
  user (state, id) {
    return state.users[id]
  },

  theme (state, id) {
    return state.themes[id]
  },

  latestThemes (state) {
    return state.latestThemes
  },

  actionErrors (state) {
    return state.actionErrors
  },

  session (state) {
    return state.session
  },

  loading (state) {
    return state.loading
  }
}
