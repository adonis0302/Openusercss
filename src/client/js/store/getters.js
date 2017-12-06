import {find, cloneDeep} from 'lodash'

const users = (state) => {
  const foundUsers = cloneDeep(state.users)

  foundUsers.forEach((user, index) => {
    const userThemes = []

    user.themes.forEach((themeObj) => {
      userThemes.push(find(state.themes, {
        '_id': themeObj._id
      }))
    })

    user.themes = userThemes
  })

  return foundUsers
}

const themes = (state) => {
  const foundThemes = cloneDeep(state.themes)

  foundThemes.forEach((theme, index) => {
    theme.user = find(state.users, {
      '_id': theme.user._id
    })
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

  return user
}

export default {
  users,
  themes,
  actionErrors,
  session,
  loading,
  currentUser
}
