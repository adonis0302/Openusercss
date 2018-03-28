import gql from 'graphql-tag'
import client from '~/../lib/apollo-client'

export const state = () => ({
  'loading': false,
  'editing': {},
})

export const getters = {
  loading (state,) {
    return state.loading
  },
  editing (state,) {
    return state.editing
  },
}

export const mutations = {
  loading (state, payload,) {
    state.loading = payload
  },
  editing (state, editing,) {
    state.editing = editing
  },
}

export const actions = {
  async resendVerify ({commit,}) {
    commit('loading', true)

    try {
      await client.mutate({
        'mutation': gql`
          mutation {
            resendVerification
          }
        `,
      })

      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },
  async verifyEmail ({commit,}, token) {
    commit('loading', true)

    try {
      const {data,} = await client.mutate({
        'mutation': gql`
          mutation($token: String!) {
            verifyEmail(token: $token)
          }
        `,
        'variables': {
          token,
        },
      })

      if (!data.verifyEmail) {
        throw new Error('Your e-mail address couldn\'t be verified. Please try again!')
      }
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },
  async submit ({commit,}, accountData) {
    commit('loading', true)

    try {
      const {data,} = await client.mutate({
        'mutation': gql`
          mutation(
            $password: String
            $displayname: String
            $email: String
            $bio: String
            $donationUrl: String
          ) {
            account(
              password: $password
              displayname: $displayname
              email: $email
              bio: $bio
              donationUrl: $donationUrl
            ) {
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
          }
        `,
        'variables': accountData,
      })

      commit('users/upsert', data.account, {
        'root': true,
      })
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },
}
