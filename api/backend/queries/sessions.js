import useSession from '../../../lib/use-session'

export default async (root, options, {Session, headers, token,}) => {
  const session = await useSession(token, Session)

  if (!session) {
    return []
  }

  return Session.find({
    'user': session.user._id,
  })
}
