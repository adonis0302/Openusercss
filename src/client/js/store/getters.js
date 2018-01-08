import db from './db'

const users = (state) => {
  try {
    const usersCol = db.getCollection('users')
    const themesCol = db.getCollection('themes')
    const dbUsers = usersCol.find({})
    const processedUsers = []

    dbUsers.forEach((user, userIndex) => {
      user.themes.forEach((theme, themeIndex) => {
        user.themes[themeIndex] = themesCol.findOne({
          '_id': theme._id,
        })
      })

      processedUsers.push(user)
    })

    return processedUsers
  } catch (error) {
    return []
  }
}

const themes = (state) => {
  try {
    const usersCol = db.getCollection('users')
    const themesCol = db.getCollection('themes')
    const dbThemes = themesCol.find({})
    const processedThemes = []

    // return dbThemes.find({})
    dbThemes.forEach((theme, themeIndex) => {
      theme.user = usersCol.findOne({
        '_id': theme.user._id,
      })

      processedThemes.push(theme)
    })

    return processedThemes
  } catch (error) {
    return []
  }
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
  const dbUsers = db.getCollection('users')

  if (!state.session) {
    return {}
  }

  const user = dbUsers.findOne({
    '_id': state.session.user._id,
  })

  return user || {}
}

export default {
  users,
  themes,
  actionErrors,
  session,
  loading,
  currentUser,
}
