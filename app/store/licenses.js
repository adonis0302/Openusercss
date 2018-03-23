import gql from 'graphql-tag'
import client from '~/../lib/apollo-client'

export const state = () => ({
  'loading': false,
  'all':     [],
})

export const mutations = {
  loading (state, isLoading) {
    state.loading = isLoading
  },
  all (state, data,) {
    state.all = data
  },
}

export const getters = {
  loading (state) {
    return state.loading
  },
  all (state) {
    return state.all
  },
}

export const actions = {
  async all ({commit,}, id) {
    commit('loading', true)

    try {
      const {data,} = await client.query({
        'query': gql`
          query {
            licenses {
              package
              repository
              license
              source
              sourceText
            }
          }
        `,
      })

      commit('all', data.licenses)
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },
}
