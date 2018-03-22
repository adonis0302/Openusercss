import mustAuthenticate from '../../../lib/enforce-session'

export default async (root, options, {Session, headers, token,}) => {
  return mustAuthenticate(token, Session)
}
