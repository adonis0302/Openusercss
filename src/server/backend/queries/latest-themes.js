import {clamp} from 'lodash'

export default async (root, {count}, {User, Theme}) => {
  const limit = clamp(count, 1, 10)
  const result = await Theme.find({}, {
    limit,
    'populate': true,
    'sort':     '-createdAt'
  })

  if (!result) {
    throw new Error('No theme found')
  }

  return result
}
