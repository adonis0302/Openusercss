import {getThemes,} from '../translators/get-theme'

export default async (root, {query,}, {User, Theme,}) => {
  const doneQuery = JSON.parse(unescape(query))
  const result = await getThemes(doneQuery)

  if (!result) {
    throw new Error('No themes found')
  }

  return result
}
