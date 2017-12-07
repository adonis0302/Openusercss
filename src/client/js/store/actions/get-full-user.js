import {cloneDeep} from 'lodash'
import {ExpectedError} from '../../../../shared/custom-errors'
import {apolloClient} from '.'
import {user as query} from './queries'

const getFullUser = async (id) => {
  let user = null

  try {
    user = await apolloClient.query({
      'query': query({id})
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
