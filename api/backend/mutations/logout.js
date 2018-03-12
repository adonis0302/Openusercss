import mustAuthenticate from '../../../lib/enforce-session'

export default async (root, options, {Session, token,}) => {
  const session = await mustAuthenticate(token, Session)
  const result = await session.delete()

  return result === 1
}
