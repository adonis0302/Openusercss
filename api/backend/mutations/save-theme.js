import {findIndex,} from 'lodash'
import mustAuthenticate from '../../../lib/enforce-session'
import parse from '../../../lib/usercss-parser'

export default async (root, {
  title,
  description,
  content,
  version,
  id,
  screenshots,
  options,
}, {Session, Theme, User, Rating, Option, token,}) => {
  const session = await mustAuthenticate(token, Session)
  const user = await User.findOne({
    '_id': session.user._id,
  })
  let newTheme = null

  if (!user.emailVerified) {
    throw new Error('You must verify your e-mail address before uploading themes.')
  }
  const parsed = await parse(decodeURIComponent(content))

  if (!parsed.code) {
    throw new Error('Parse result is empty. Is your CSS valid?')
  }

  const parsedOptions = JSON.parse(decodeURIComponent(options))

  if (id) {
    newTheme = await Theme.findOne({
      '_id': id,
    })
    const userOwnsTheme = session.user._id.equals(newTheme.user._id)

    if (!newTheme || !userOwnsTheme) {
      throw new Error('No theme found')
    }

    newTheme.title = decodeURIComponent(title)
    newTheme.description = decodeURIComponent(description)
    newTheme.version = version
    newTheme.content = parsed.code
    newTheme.screenshots = screenshots
    newTheme.options = parsedOptions

    const userThemeIndex = findIndex(user.themes, {
      '_id': id,
    })

    user.themes[userThemeIndex] = newTheme
  } else {
    newTheme = Theme.create({
      'user':        session.user,
      'content':     parsed.code,
      'description': decodeURIComponent(description),
      'options':     parsedOptions,
      'title':       decodeURIComponent(title),
      version,
      screenshots,
    })
  }

  const savedTheme = await newTheme.save()

  await user.save()
  savedTheme.ratings = await Rating.find({
    'theme': savedTheme._id,
  })

  return savedTheme
}
