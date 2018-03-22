import {cloneDeep,} from 'lodash'
import gql from 'graphql-tag'
import moment from 'moment'

import client from '~/../lib/apollo-client'

export const state = () => ({
  'loading': false,
  'themes':  [],
})

export const mutations = {
  loading (state, isLoading,) {
    state.loading = isLoading
  },
  upsert (state, newTheme,) {
    const existingIndex = state.themes.findIndex((theme) => newTheme._id === theme._id)

    if (existingIndex !== -1) {
      state.themes[existingIndex] = newTheme
    } else {
      state.themes.push(newTheme)
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
  latest (state,) {
    const copy = cloneDeep(state.themes)

    copy.sort((a, b) => {
      return !moment(a.createdAt).isAfter(b.createdAt)
    })

    return copy
  },
  popular (state,) {
    const copy = cloneDeep(state.themes)

    copy.sort((a, b) => {
      return true
    })

    return copy
  },
}

export const actions = {
  async latest ({commit, state,}) {
    const {data,} = await client.query({
      'query': gql`
        query($limit: Int!) {
          latestThemes(limit: $limit) {
            _id
            user {
              _id
              username
              displayname
              avatarUrl
              smallAvatarUrl
            }
            title
            description
            createdAt
            lastUpdate
          }
        }
      `,
      'variables': {
        'limit': 6,
      },
    })

    data.latestThemes.forEach((theme) => {
      commit('upsert', theme)
    })
  },
  async popular ({commit, state,}) {
    const {data,} = await client.query({
      'query': gql`
        query($limit: Int!) {
          popularThemes(limit: $limit) {
            _id
            user {
              _id
              username
              displayname
              avatarUrl
              smallAvatarUrl
            }
            title
            description
            createdAt
            lastUpdate
          }
        }
      `,
      'variables': {
        'limit': 6,
      },
    })

    data.popularThemes.forEach((theme) => {
      commit('upsert', theme)
    })
  },
  async single ({commit, state,}, id) {
    commit('loading', true)

    try {
      const {data,} = await client.query({
        'query': gql`
          query($id: ID!) {
            theme(id: $id) {
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

      commit('users/upsert', data.theme.user, {
        'root': true,
      })
      Reflect.deleteProperty(data.theme, 'user')
      commit('upsert', data.theme)
      commit('loading', false)
    } catch (error) {
      commit('loading', false)
      throw error
    }
  },
}
