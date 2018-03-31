import gql from 'graphql-tag'
import client from '~/../lib/apollo-client'

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
        'query': gql`
          query(
            $terms: String!
            $limit: Int
            $skip:  Int
          ) {
            search(
              terms: $terms
              limit: $limit
              skip:  $skip
            ) {
              users {
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

              themes {
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
          }
        `,
        'variables': {
          terms,
          limit,
          skip,
        },
      })

      data.search.users.forEach((user) => {
        commit('users/upsert', user, {
          'root': true,
        })
      })

      data.search.themes.forEach((theme) => {
        commit('themes/upsert', theme, {
          'root': true,
        })
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
