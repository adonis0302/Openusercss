import mustAuthenticate from '../../shared/enforce-session'

export default async (root, {token}, {Session}) => {
  await mustAuthenticate(token, Session)

  return true
}
