import {getUser} from '../translators/get-user'

export default async (root, {id}, {Session, Theme, User, Rating}) => {
  const foundUser = await getUser({
    '_id': id
  })

  if (!foundUser) {
    throw new Error('No user found')
  }

  return foundUser
}
