import client from '~/../lib/apollo-client'
import searchQuery from '~/apollo/queries/search.gql'

export const state = () => ({
  'loading': false,
  'results': {},
})

export const mutations = {
  loading (state, payload) {
    state.loading = payload
  },
  upsert (state, {terms, payload,}) {
    state.results[terms] = payload
  },
}

export const getters = {
  loading (state) {
    return state.loading
  },
  single (state) {
    return (terms) => state.results[terms]
  },
}

export const actions = {
  async submit ({commit,}, {terms, limit, skip,}) {
    commit('loading', true)

    try {
      const {data,} = await client.query({
        'query':     searchQuery,
        'variables': {
          terms,
          limit,
          skip,
        },
      })

      commit('upsert', {
        'payload': data.search,
        terms,
      })
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },
}
