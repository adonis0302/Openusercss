import mustAuthenticate from '../../shared/enforce-session'

export default async (root, {token}, {Session}) => {
  return mustAuthenticate(token, Session)
}
