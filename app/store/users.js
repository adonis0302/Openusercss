import gql from 'graphql-tag'
import client from '~/../lib/apollo-client'

export const state = () => ({
  'loading': false,
  'users':   [],
})

export const mutations = {
  loading (state, isLoading) {
    state.loading = isLoading
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
        'query': gql`
          query($id: ID!) {
            user(id: $id) {
              _id
              username
              displayname
              avatarUrl
              smallAvatarUrl
              lastSeen
              lastSeenReason
              createdAt
              lastUpdate
              bio
              donationUrl
            }

            userThemes(id: $id) {
              _id
              user {
                _id
                username
                displayname
                avatarUrl
                smallAvatarUrl
                lastSeen
                lastSeenReason
                createdAt
                lastUpdate
                bio
                donationUrl
              }
              title
              description
              content
              createdAt
              lastUpdate
              version
              screenshots
              options {
                type
                label
                name
                value
              }
            }
          }
        `,
        'variables': {
          id,
        },
      })

      data.userThemes.forEach((theme) => {
        commit('themes/upsert', theme, {
          'root': true,
        })
      })
      commit('upsert', data.user)
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },
}
