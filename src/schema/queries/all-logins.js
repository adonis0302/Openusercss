export default async (root, data, {Logins}) => {
  const foundLogins = await Logins.find({})

  return foundLogins.toArray()
}
