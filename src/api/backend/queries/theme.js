export default async (root, {id}, {User, Theme}) => {
  const result = await Theme.findOne({
    '_id': id
  })

  if (!result) {
    throw new Error('No theme found')
  }

  return result
}
