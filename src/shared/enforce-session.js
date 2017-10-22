// @flow

import staticConfig from '../config'
import jwt from 'jsonwebtoken'
import {expected} from './custom-errors'

const {AuthenticationError} = expected

export default async (token: String, Session) => {
  const config = await staticConfig()
  let session = null

  session = await Session.findOne({
    token
  })

  if (!await session) {
    throw new Error('Invalid session')
  }

  try {
    jwt.verify(token, config.get('keypair.clientprivate'), {
      'issuer':     config.get('domain'),
      'algorithms': [
        'HS256'
      ]
    })
  } catch (error) {
    throw new AuthenticationError(error.message)
  }

  return session
}
