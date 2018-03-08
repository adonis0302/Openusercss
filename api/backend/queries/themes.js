export default async (root, {query,}, {User, Theme,}) => {
  const result = await Theme.find(query, {
    'populate': true,
  })

  if (!result) {
    throw new Error('No themes found')
  }

  return result
}
