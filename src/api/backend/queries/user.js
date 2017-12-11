import {ObjectId} from 'mongodb'
import {pick} from 'lodash'

export default async (root, {id}, {Session, Theme, User}) => {
  const foundUser = await User.findOne({
    '_id': new ObjectId(id)
  }, {
    'populate': true
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
    'lastSeenReason',
    'themes'
  ])

  return user
}
