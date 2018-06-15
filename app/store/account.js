import client from '~/../lib/apollo-client'
import verifyEmailMutation from '~/apollo/mutations/verify-email.gql'
import resendVerificationMutation from '~/apollo/mutations/resend-verification.gql'
import accountMutation from '~/apollo/mutations/account.gql'

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
        'mutation': resendVerificationMutation,
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
        'mutation':  verifyEmailMutation,
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
        'mutation':  accountMutation,
        'variables': accountData,
      })

      commit('users/upsert', data.account, {
        'root': true,
      })
      commit('session/viewer', data.account, {
        'root': true,
      })
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },
}
