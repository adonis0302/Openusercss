export default {
  users (state) {
    return state.users
  },

  themes (state) {
    return state.themes
  },

  actionErrors (state) {
    return state.actionErrors
  },

  session (state) {
    return state.session
  },

  loading (state) {
    return state.loading
  },

  currentUser (state) {
    if (!state.session) {
      return {}
    }
    return state.session.user
  }
}
