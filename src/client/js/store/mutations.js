import localStore from 'store2'
import {union} from 'lodash'

/*
 * All mutations are synchronous
 */

export default {
  login (state, {data}) {
    state.session = data.login
    if (data.login && data.login.user) {
      state.users[data.login.user._id] = data.login.user
    }

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
  },

  users (state, user) {
    state.users[user._id] = user
  },

  themes (state, theme) {
    state.themes[theme._id] = theme
  }
}
