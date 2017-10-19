import localStore from 'store2'

/*
 * All mutations are synchronous
 */

export default {
  login (state, {data}) {
    state.session = data.login
    localStore.set('session', data.login)
    state.loginError = null
  },

  logout (state) {
    state.session = null
  },

  loginFailure (state, message) {
    state.token = null
    state.loginError = message
  },

  actionError (state, message) {
    state.token = null
    state.actionError = message
  },

  updateFormData (state, payload) {
    state.loginError = null
    state.formData = payload
  },

  deleteSessionData (state) {
    state.session = null
  },

  loading (state, isLoading) {
    state.loading = isLoading
  }
}
