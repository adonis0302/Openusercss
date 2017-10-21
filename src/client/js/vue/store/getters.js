export default {
  currentUser (state) {
    if (!state.session) {
      return null
    }
    return state.session.user
  },

  latestThemes (state) {
    return state.latestThemes
  },

  formData (state) {
    return state.formData
  },

  actionErrors (state) {
    return state.actionErrors
  },

  token (state) {
    if (state.session) {
      return state.session.token
    }

    return null
  },

  loading (state) {
    return state.loading
  }
}
