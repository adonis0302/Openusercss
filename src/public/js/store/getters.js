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

  token (state) {
    if (state.session) {
      return state.session.auth.token
    }

    return null
  }
}
