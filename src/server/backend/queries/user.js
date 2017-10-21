/* eslint no-underscore-dangle:0 */

import {ObjectId} from 'mongodb'
import {pick} from 'lodash'

export default async (root, {id, token}, {Session, Theme, User}) => {
  const foundUser = await User.findOne({
    '_id': new ObjectId(id)
  })
  const user = pick(foundUser, [
    '_id',
    'username',
    'displayname'
  ])

  user.themes = await Theme.find({
    'user': new ObjectId(id)
  }, {
    'limit': 256
  })

  return user
}
