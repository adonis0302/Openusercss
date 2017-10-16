import mustAuthenticate from '../../shared/enforce-session'

export default async (root, {token}, {Logins}) => {
  await mustAuthenticate(token, Logins)
  const operation = Logins.findAndRemove({
    token
  })
  const result = await operation

  if (result.ok === 1 && result.value) {
    return result
  }

  return null
}
