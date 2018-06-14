import client from '~/../lib/apollo-client'
import assert from 'assert'

import themeMutation from '~/apollo/mutations/theme.gql'
import deleteMutation from '~/apollo/mutations/delete-theme.gql'
import latestThemesQuery from '~/apollo/queries/latest-themes.gql'
import popularThemesQuery from '~/apollo/queries/popular-themes.gql'
import themeQuery from '~/apollo/queries/theme.gql'
import userQuery from '~/apollo/queries/user-themes.gql'

export const state = () => ({
  'loading': false,
  'themes':  [],
  'editing': {},
  'error':   null,
})

export const mutations = {
  loading (state, isLoading,) {
    state.loading = isLoading
  },
  editTemp (state, {theme, id,}) {
    state.editing[id] = theme
  },
  delete (state, id,) {
    const index = state.themes.findIndex((theme) => theme._id === id)

    state.themes.splice(index, 1)
  },
  upsert (state, newTheme,) {
    const existingIndex = state.themes.findIndex((theme) => newTheme._id === theme._id)

    if (existingIndex !== -1) {
      state.themes[existingIndex] = newTheme
    } else {
      state.themes.push(newTheme)
    }
  },
  error (state, error) {
    assert(
      error instanceof Error || error === null,
      'error passed to error mutation must be an instance of Error or be null'
    )

    if (!error) {
      state.error = null
    } else {
      state.error = error.message
    }
  },
}

export const getters = {
  loading (state) {
    return state.loading
  },
  all (state,) {
    return state.themes
  },
  single (state) {
    return (id) => state.themes.find((theme) => theme._id === id)
  },
  editCache (state,) {
    return state.editing
  },
  error (state) {
    if (!state.error) {
      return null
    }

    return state.error
  },
}

export const actions = {
  async submit ({commit, state,}, {
    id,
    title,
    description,
    content,
    version,
    screenshots,
    variables,
    license,
  }) {
    const {data,} = await client.mutate({
      'mutation':  themeMutation,
      'variables': {
        id,
        title,
        description,
        content,
        version,
        screenshots,
        variables,
        license,
      },
    })

    commit('upsert', data.theme)
  },

  async latest ({commit, state,}) {
    const {data,} = await client.query({
      'query':     latestThemesQuery,
      'variables': {
        'limit': 6,
      },
    })

    data.latestThemes.forEach((theme) => {
      commit('users/upsert', theme.user, {
        'root': true,
      })
      commit('upsert', theme)
    })
  },

  async popular ({commit, state,}) {
    const {data,} = await client.query({
      'query':     popularThemesQuery,
      'variables': {
        'limit': 6,
      },
    })

    data.popularThemes.forEach((theme) => {
      commit('users/upsert', theme.user, {
        'root': true,
      })
      commit('upsert', theme)
    })
  },

  async single ({commit, state,}, id) {
    commit('loading', true)

    try {
      const {data,} = await client.query({
        'query':     themeQuery,
        'variables': {
          id,
        },
      })

      commit('users/upsert', data.theme.user, {
        'root': true,
      })
      commit('upsert', data.theme)
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },

  async user ({commit,}, id,) {
    commit('loading', true)

    try {
      const {data,} = await client.query({
        'query':     userQuery,
        'variables': {
          id,
        },
      })

      data.userThemes.forEach((theme) => {
        commit('upsert', theme)
      })
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
    }
  },

  async delete ({commit,}, id,) {
    commit('loading', true)

    try {
      await client.mutate({
        'mutation':  deleteMutation,
        'variables': {
          id,
        },
      })

      commit('error', null)
      commit('delete', id)
      commit('loading', false)
    } catch (error) {
      commit('error', error)
      commit('delete', id)
      commit('loading', false)
      throw error
    }
  },
}
