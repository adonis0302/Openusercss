import {findIndex} from 'lodash'
import mustAuthenticate from '../../../shared/enforce-session'

export default async (root, {
  token,
  title,
  description,
  content,
  version,
  id,
  screenshots,
  options
}, {Session, Theme, User, Option}) => {
  const session = await mustAuthenticate(token, Session)
  const user = await User.findOne({
    '_id': session.user._id
  })
  let newTheme = null

  if (!user.emailVerified) {
    throw new Error('You must verify your e-mail address before uploading themes.')
  }

  if (id) {
    newTheme = await Theme.findOne({
      '_id': id
    })
    const userOwnsTheme = session.user._id.equals(newTheme.user._id)

    if (!newTheme || !userOwnsTheme) {
      throw new Error('No theme found')
    }

    newTheme.title = title
    newTheme.description = decodeURIComponent(description)
    newTheme.version = version
    newTheme.content = decodeURIComponent(content)
    newTheme.screenshots = screenshots
    newTheme.options = []

    options.forEach((option) => {
      const savedOption = Option.create(option)

      newTheme.options.push(savedOption)
    })

    const userThemeIndex = findIndex(user.themes, {
      '_id': id
    })

    user.themes[userThemeIndex] = newTheme
  } else {
    newTheme = Theme.create({
      'user':        session.user,
      'content':     decodeURIComponent(content),
      'description': decodeURIComponent(description),
      options,
      title,
      version,
      screenshots
    })
    user.themes.push(newTheme)
  }

  const savedTheme = await newTheme.save()

  await user.save()
  return savedTheme
}
