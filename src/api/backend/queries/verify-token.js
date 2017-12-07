import mustAuthenticate from '../../../shared/enforce-session'

export default async (root, {token}, {Session, headers}) => {
  return mustAuthenticate(token, Session)
}
