export default async (root, {terms, count, offset}, {Session, Theme}) => {
  const results = []

  results.push(await Theme.find(
    'title': terms
  ))

  return results
}
