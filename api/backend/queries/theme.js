export default async (root, {id,}, {User, Theme,}) => {
  const result = await Theme.findOne({
    '_id': id,
  }, {
    'populate': true,
  })

  if (!result) {
    throw new Error('no-such-theme')
  }

  return result
}
