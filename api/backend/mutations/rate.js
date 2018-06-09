import {ObjectID,} from 'mongodb'
import mustAuthenticate from '../../../lib/enforce-session'

export default async (root, {id, value,}, {Session, Theme, Rating, User, token,}) => {
  const session = await mustAuthenticate(token, Session)
  const user = await User.findOne({
    '_id': session.user._id,
  })
  const theme = await Theme.findOne({
    '_id': id,
  })

  // Sanity checks
  if (!theme) {
    throw new Error('no-such-theme')
  }

  if (theme.user._id.equals(user._id)) {
    throw new Error('cannot-rate-own-theme')
  }

  // Load the existing rating object
  let existing = await Rating.findOne({
    'theme': new ObjectID(id),
    'user':  user._id,
  })

  if (existing) {
    // If we found an existing rating, update it
    existing.value = value
    existing.theme = theme
  } else {
    // Otherwise, create a new one
    existing = Rating.create({
      user,
      theme,
      value,
    })
  }

  await existing.save()

  return existing
}
