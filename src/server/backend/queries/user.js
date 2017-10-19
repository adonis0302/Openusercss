/* eslint no-underscore-dangle:0 */

import {ObjectId} from 'mongodb'

export default async (root, {id, token}, {Session, Theme, User}) => {
  const foundUser = await User.findOne({
    '_id': new ObjectId(id)
  }, {
    'populate': true
  })
  const user = {
    '_id':         foundUser._id,
    'username':    foundUser.username,
    'displayname': foundUser.displayname
  }

  user.themes = await Theme.find({
    'user': new ObjectId(id)
  }, {
    'limit': 256
  })

  return user
}
