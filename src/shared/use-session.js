// @flow

import staticConfig from '../../shared/config'
import jwt from 'jsonwebtoken'

export default async (token: String, Session) => {
  const config = await staticConfig()
  let session = null

  session = await Session.findOne({
    token,
  })

  try {
    jwt.verify(token, config.get('keypair.clientprivate'), {
      'issuer':     config.get('domain'),
      'algorithms': [
        'HS256',
      ],
    })
  } catch (error) {
    session = null
  }

  return session
}
