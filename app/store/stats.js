import {
  themeHits,
} from '~/plugins/matomo-api'
import assert from 'assert'

export const state = () => ({
  'themes': {},
  'error':  null,
})

export const getters = {
  theme (state) {
    return (id) => state.themes[id]
  },
  error (state) {
    return state.error
  },
}

export const mutations = {
  theme (state, {id, payload,}) {
    state.themes[id] = payload
  },
  error (state, error) {
    assert(
      error instanceof Error,
      'Argument passed to the error mutation must be an instance of Error'
    )

    state.error = error
  },
}

export const actions = {
  async hits ({commit,}, id) {
    let payload = null

    try {
      payload = await themeHits({id,},)
    } catch (error) {
      commit('error', error)
    }

    commit('theme', {
      id,
      payload,
    })
  },
}
