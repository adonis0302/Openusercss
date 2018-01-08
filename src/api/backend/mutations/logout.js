import mustAuthenticate from '../../../shared/enforce-session'

export default async (root, {token,}, {Session,}) => {
  const session = await mustAuthenticate(token, Session)
  /* const session = await Session.findOne({
    token
  }) */
  const result = await session.delete()

  return result === 1
}
