import {cloneDeep,} from 'lodash'
import gql from 'graphql-tag'

import client from '~/../lib/apollo-client'

export const state = () => ({
  'themes': [],
})

export const mutations = {
  insert (state, theme,) {
    state.themes.push(theme)
  },
}

export const getters = {
  latestThemes (state,) {
    const copy = cloneDeep(state.themes)

    copy.sort((a, b) => {
      // TODO: This following line isn't final, use momentjs to compare
      return a.createdAt - b.createdAt
    })

    return copy
  },
}

export const actions = {
  async latestThemes ({commit, state,}) {
    const {data,} = await client.query({
      'query': gql`
        query($limit: Int!) {
          latestThemes(limit: $limit) {
            _id
          }
        }
      `,
      'variables': {
        'limit': 6,
      },
    })

    data.latestThemes.forEach((theme) => {
      commit('insert', theme)
    })
  },
  async popularThemes ({commit, state,}) {
    const {data,} = await client.query({
      'query': gql`
        query($limit: Int!) {
          popularThemes(limit: $limit) {
            _id
          }
        }
      `,
      'variables': {
        'limit': 6,
      },
    })

    data.latestThemes.forEach((theme) => {
      commit('insert', theme)
    })
  },
}
