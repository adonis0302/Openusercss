import mustAuthenticate from '../../shared/enforce-session'

export default async (root, {token}, context) => {
  await mustAuthenticate(token, context.Logins)

  return true
}
