import useSession from '../../lib/use-session'

export default async (root, options, {Session, token,}) => {
  const session = await useSession(token, Session)

  if (!session || !session.user) {
    return null
  }

  return session.user
}
