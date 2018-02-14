import {findIndex,} from 'lodash'
import mustAuthenticate from '../../../shared/enforce-session'
import parse from '../../../shared/usercss-parser'
import {getTheme,} from '../translators/get-theme'
import {getUser,} from '../translators/get-user'
import {getRatings,} from '../translators/get-rating'

export default async (root, {
  token,
  title,
  description,
  content,
  version,
  id,
  screenshots,
  options,
}, {Session, Theme, User, Option,}) => {
  const session = await mustAuthenticate(token, Session)
  const user = await getUser({
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
    newTheme = await getTheme({
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
  savedTheme.ratings = await getRatings({
    'theme': savedTheme._id,
  })

  return savedTheme
}
