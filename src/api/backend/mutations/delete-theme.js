import mustAuthenticate from '../../../shared/enforce-session'

export default async (root, {token, title, description, content, scope, version, id}, {Session, Theme, User}) => {
  await mustAuthenticate(token, Session)
  const theme = await Theme.findOne({
    '_id': id
  })

  if (!theme) {
    throw new Error('No theme found')
  }

  const result = await theme.delete()

  return result
}
