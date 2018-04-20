import useSession from '../../../lib/use-session'

export default async (root, options, {Session, headers, token,}) => {
  const session = await useSession(token, Session)

  if (!session) {
    return []
  }

  const results = await Session.find({
    'user': session.user._id,
  })

  return results.map((result) => ({
    '_id':       result._id,
    'expiresAt': result.expiresAt,
    'createdAt': result.createdAt,
    'ip':        result.ip,
    'ua':        result.ua,
  }))
}
