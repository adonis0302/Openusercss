export default async (root, data, {Users}) => {
  const foundUsers = await Users.find({})

  return foundUsers.toArray()
}
