import {getTheme,} from '../translators/get-theme'

export default async (root, {id,}, {User, Theme,}) => {
  const result = await getTheme({
    '_id': id,
  })

  if (!result) {
    throw new Error(`No theme found with id ${id}`)
  }

  return result
}
