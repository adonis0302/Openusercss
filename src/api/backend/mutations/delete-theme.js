import mustAuthenticate from '../../../shared/enforce-session'

export default async (root, {token, title, description, content, scope, version, id}, {Session, Theme, User}) => {
  const session = await mustAuthenticate(token, Session)
  const theme = await Theme.findOne({
    '_id': id
  })
  let userOwnsTheme = false

  if (theme) {
    userOwnsTheme = session.user._id.equals(theme.user._id)
  }

  if (!theme || !userOwnsTheme) {
    throw new Error('No theme found')
  }

  const result = await theme.delete()

  return result
}
