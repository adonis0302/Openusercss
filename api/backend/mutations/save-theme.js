import mustAuthenticate from '../../../lib/enforce-session'
import parse from '../../../lib/usercss-parser'

import moment from 'moment'

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
    throw new Error('email-not-verified')
  }
  const parsed = await parse(content)

  if (!parsed.code) {
    throw new Error('empty-parse-result')
  }

  if (id) {
    newTheme = await Theme.findOne({
      '_id': id,
    })
    const userOwnsTheme = session.user._id.equals(newTheme.user._id)

    if (!newTheme || !userOwnsTheme) {
      throw new Error('no-such-theme')
    }

    newTheme.title = title
    newTheme.description = description
    newTheme.version = version
    newTheme.content = parsed.code
    newTheme.screenshots = screenshots
    newTheme.options = options

    user.lastSeenReason = 'updating a theme'
  } else {
    newTheme = Theme.create({
      'user':    session.user,
      'content': parsed.code,
      description,
      options,
      title,
      version,
      screenshots,
    })

    user.lastSeenReason = 'uploading a new theme'
  }

  const savedTheme = await newTheme.save()

  user.lastSeen = moment().toJSON()

  await user.save()
  savedTheme.ratings = await Rating.find({
    'theme': savedTheme._id,
  })

  return savedTheme
}
