export default async (root, {id,}, {Session, Theme, User, Rating,}) => {
  const foundUser = await User.findOne({
    '_id': id,
  }, {
    'populate': true,
  })

  if (!foundUser) {
    throw new Error('no-such-user')
  }

  return foundUser
}
