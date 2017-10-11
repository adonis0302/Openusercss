import mustAuthenticate from '../../utils/enforce-token'

export default async (root, {token}, context) => {
  await mustAuthenticate(token)

  return 'Taking over the world on Tuesday!'
}
