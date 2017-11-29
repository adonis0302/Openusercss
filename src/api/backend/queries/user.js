import {ObjectId} from 'mongodb'
import {pick} from 'lodash'

export default async (root, {id}, {Session, Theme, User}) => {
  const foundUser = await User.findOne({
    '_id': new ObjectId(id)
  })

  if (!foundUser) {
    throw new Error('No user found')
  }

  const user = pick(foundUser, [
    '_id',
    'username',
    'displayname',
    'avatarUrl',
    'smallAvatarUrl',
    'lastSeen',
    'lastSeenReason'
  ])

  user.themes = await Theme.find({
    'user': new ObjectId(id)
  }, {
    'limit': 256
  })

  return user
}
