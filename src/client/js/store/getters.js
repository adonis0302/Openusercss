import {find, cloneDeep} from 'lodash'

const users = (state) => {
  const foundUsers = cloneDeep(state.users)

  if (!foundUsers) {
    return []
  }

  foundUsers.forEach((user, index) => {
    const userThemes = []

    if (user.themes) {
      state.themes.forEach((themeObj) => {
        user.themes.forEach((userTheme) => {
          if (userTheme._id === themeObj._id) {
            userThemes.push(themeObj)
          }
        })
      })
    }

    user.themes = userThemes
  })

  return foundUsers
}

const themes = (state) => {
  const foundThemes = cloneDeep(state.themes)

  if (!foundThemes) {
    return []
  }

  foundThemes.forEach((theme, index) => {
    theme.user = find(state.users, {
      '_id': theme.user._id
    })

    if (!theme.user) {
      theme.user = {
        'themes': []
      }
    }
  })

  return foundThemes
}

const actionErrors = (state) => {
  return state.actionErrors
}

const session = (state) => {
  return state.session
}

const loading = (state) => {
  return state.loading
}

const currentUser = (state) => {
  if (!state.session) {
    return {}
  }

  const user = find(state.users, {
    '_id': state.session.user._id
  })

  return user || {}
}

export default {
  users,
  themes,
  actionErrors,
  session,
  loading,
  currentUser
}
