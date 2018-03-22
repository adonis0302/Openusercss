import mustAuthenticate from '../../../lib/enforce-session'

export default async (root, {id,}, {Session, Theme, token,}) => {
  const session = await mustAuthenticate(token, Session)
  const theme = await Theme.findOne({
    '_id': id,
  })
  let userOwnsTheme = false

  if (theme) {
    userOwnsTheme = session.user._id.equals(theme.user._id)
  }

  if (!theme || !userOwnsTheme) {
    throw new Error('no-such-theme')
  }

  const result = await theme.delete()

  return result
}
