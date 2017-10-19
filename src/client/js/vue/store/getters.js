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

  testText (state) {
    return state.testText
  },

  loginError (state) {
    return state.sessionError
  },

  actionError (state) {
    return state.actionError
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
