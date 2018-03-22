import {ObjectID,} from 'mongodb'

export default async (root, {id,}, {User, Theme,}) => {
  const result = await Theme.find({
    'user': new ObjectID(id),
  }, {
    'populate': true,
  })

  if (!result) {
    throw new Error('no-such-theme')
  }

  return result
}
