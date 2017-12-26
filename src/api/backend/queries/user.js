import {ObjectId} from 'mongodb'

export default async (root, {id}, {Session, Theme, User}) => {
  const foundUser = await User.findOne({
    '_id': new ObjectId(id)
  }, {
    'populate': true
  })

  if (!foundUser) {
    throw new Error('No user found')
  }

  return foundUser
}
