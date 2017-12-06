import gql from 'graphql-tag'
import {cloneDeep} from 'lodash'

import router from '../../router'
import {expected} from '../../../../shared/custom-errors'
import {apolloClient} from '.'

const {AuthenticationError} = expected

const remoteLogin = async ({email, password}) => {
  const mutation = gql(`
    mutation {
      login(email: "${email}", password: "${password}") {
        token,
        user {
          themes {
            _id,
            title,
            description,
            createdAt,
            lastUpdate,
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
    }
  `)
  let session = null

  try {
    session = await apolloClient.mutate({
      mutation
    })
  } catch (error) {
    throw new AuthenticationError(error.message)
  }

  return session
}

export default async ({commit}, authData) => {
  commit('loading', true)

  try {
    const {data} = await remoteLogin(authData)
    const {login} = data

    commit('login', {
      'token': login.token,
      'user':  {
        '_id': login.user._id
      }
    })

    const {user} = cloneDeep(login)
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

    if (user.themes.length) {
      user.themes.forEach((theme) => {
        userThemeRefs.push({
          '_id': theme._id
        })
      })
    }

    commit('users', [
      {
        ...user,
        'themes': userThemeRefs
      }
    ])

    /* const user = pick(login.user, [
      '_id',
      'displayname',
      'username',
      'avatarUrl',
      'smallAvatarUrl',
      'lastSeen',
      'lastSeenReason'
    ])

    user.themes = []
    login.user.themes.forEach((theme) => {
      user.themes.push(theme._id)
    })

    commit('users', [
      user
    ]) */
    commit('actionError', null)
    router.push('/')
  } catch (error) {
    commit('actionError', error)
  }

  commit('loading', false)
}
