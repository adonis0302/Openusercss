/* eslint no-underscore-dangle:0 */

import {ObjectId} from 'mongodb'
import {pick} from 'lodash'
import gravatarUrl from 'gravatar-url'

export default async (root, {id, token}, {Session, Theme, User}) => {
  const foundUser = await User.findOne({
    '_id': new ObjectId(id)
  })

  foundUser.avatarUrl = gravatarUrl(foundUser.email, {
    'size': 425
  })
  foundUser.smallAvatarUrl = gravatarUrl(foundUser.email, {
    'size': 15
  })

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
