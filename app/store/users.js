import client from '~/../lib/apollo-client'
import userQuery from '~/apollo/queries/user.gql'

export const state = () => ({
  'loading': false,
  'users':   [],
})

export const mutations = {
  loading (state, isLoading) {
    state.loading = isLoading
  },
  delete (state, id,) {
    const index = state.users.find((user) => user._id === id)

    state.users.splice(index, 1)
  },
  upsert (state, newUser,) {
    const existingIndex = state.users.findIndex((user) => newUser._id === user._id)

    if (existingIndex !== -1) {
      state.users[existingIndex] = newUser
    } else {
      state.users.push(newUser)
    }
  },
}

export const getters = {
  loading (state) {
    return state.loading
  },
  all (state) {
    return state.users
  },
  single (state) {
    return (id) => state.users.find((user) => user._id === id)
  },
}

export const actions = {
  async single ({commit,}, id) {
    commit('loading', true)

    try {
      const {data,} = await client.query({
        'query':     userQuery,
        'variables': {
          id,
        },
      })

      commit('upsert', data.user)
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },
}
