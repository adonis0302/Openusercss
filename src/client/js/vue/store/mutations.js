import localStore from 'store2'
import {union} from 'lodash'

/*
 * All mutations are synchronous
 */

export default {
  login (state, {data}) {
    state.session = data.login
    localStore.set('session', data.login)
    state.actionErrors = []
  },

  logout (state) {
    state.session = null
  },

  actionError (state, message) {
    if (message) {
      state.actionErrors = union(state.actionErrors, [
        message
      ])
    } else {
      state.actionErrors = []
    }
  },

  updateFormData (state, payload) {
    state.actionErrors = []
    state.formData = payload
  },

  loading (state, isLoading) {
    state.loading = isLoading
  }
}
