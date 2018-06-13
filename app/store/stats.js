import {
  themeHits,
} from '~/plugins/matomo-api'
import assert from 'assert'
import raven from 'raven-js'

export const state = () => ({
  'themes':  {},
  'error':   null,
  'loading': false,
})

export const getters = {
  theme (state) {
    return (id) => state.themes[id]
  },
  all (state) {
    return state.themes
  },
  error (state) {
    return state.error
  },
  loading (state) {
    return state.loading
  },
}

export const mutations = {
  theme (state, {id, payload,}) {
    state.themes[id] = payload
  },
  error (state, error) {
    if (!error) {
      state.error = null
      return
    }

    assert(
      error instanceof Error,
      'Argument passed to the error mutation must be an instance of Error'
    )

    state.error = error.message
  },
  loading (state, isLoading) {
    state.loading = isLoading
  },
}

export const actions = {
  async hits ({commit,}, id) {
    commit('loading', true)

    try {
      const payload = await themeHits({id,},)
      .timeout(4096)

      if (payload) {
        commit('theme', {
          id,
          payload,
        })
      }
      commit('error', null)
    } catch (error) {
      raven.captureException(error)
      commit('error', error)
    }

    commit('loading', false)
  },

  async refill ({rootGetters, commit,},) {
    commit('loading', true)
    const gets = []
    const themes = rootGetters['themes/all']

    themes.forEach((theme) => {
      gets.push(themeHits({
        'id': theme._id,
      }))
    })

    try {
      const result = await Promise.all(gets)
      .timeout(4096)

      result.forEach((payload, index) => {
        if (payload) {
          commit('theme', {
            'id': themes[index]._id,
            payload,
          })
        }
      })

      commit('error', null)
    } catch (error) {
      raven.captureException(error)
      commit('error', error)
    }

    commit('loading', false)
  },
}
