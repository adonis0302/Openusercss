import hat from 'hat'

/*
 * All mutations are synchronous
 */

export default {
  login (state, token) {
    state.token = token
    state.loginError = null
  },

  loginFailure (state, message) {
    state.token = null
    state.loginError = message
  },

  updateFormData (state, payload) {
    state.loginError = null
    state.formData = payload
  },

  changeTestText (state) {
    state.testText = hat()
  }
}
