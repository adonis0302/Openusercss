import {cloneDeep,} from 'lodash'
import gql from 'graphql-tag'
import moment from 'moment'

import client from '~/../lib/apollo-client'

export const state = () => ({
  'themes': [],
})

export const mutations = {
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
}
