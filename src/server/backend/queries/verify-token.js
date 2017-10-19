import mustAuthenticate from '../../shared/enforce-session'

export default async (root, {token}, context) => {
  return mustAuthenticate(token, context.Session)
}
