import mustAuthenticate from '../../shared/enforce-session'

export default async (root, {token}, {Session}) => {
  await mustAuthenticate(token, Session)
  const result = await Session.deleteOne({
    token
  })

  return result === 1
}
