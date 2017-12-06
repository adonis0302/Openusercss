import gql from 'graphql-tag'
import {cloneDeep} from 'lodash'
import {ExpectedError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const getFullUser = async (id) => {
  const userQuery = gql(`
    query {
      user(id: "${id}") {
        themes {
          _id,
          title,
          description,
          createdAt,
          lastUpdate,
          scope,
          rating
        },
        _id,
        displayname,
        username,
        avatarUrl,
        smallAvatarUrl,
        lastSeen,
        lastSeenReason
      }
    }
  `)
  let user = null

  try {
    user = await apolloClient.query({
      'query': userQuery
    })
  } catch (error) {
    throw new ExpectedError({
      'message': error.message
    })
  }

  return user
}

export default async ({commit, getters}, id) => {
  commit('loading', true)

  try {
    const {data} = await getFullUser(id)
    const {user} = cloneDeep(data)
    const userThemes = []

    if (user.themes.length) {
      user.themes.forEach((theme) => {
        userThemes.push({
          ...theme,
          'user': {
            '_id': user._id
          }
        })
      })

      commit('themes', userThemes)
    }

    const userThemeRefs = []

    user.themes.forEach((theme) => {
      userThemeRefs.push({
        '_id': theme._id
      })
    })

    commit('users', [
      {
        ...user,
        'themes': userThemeRefs
      }
    ])
    commit('actionError', null)
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
