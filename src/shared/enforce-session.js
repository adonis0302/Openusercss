// @flow

import staticConfig from '../config'
import jwt from 'jsonwebtoken'
import {AuthenticationError} from './custom-errors'
import {handle} from './error-handler'

export default async (token: String, Logins) => {
  const config = await staticConfig()

  try {
    jwt.verify(token, config.get('keypair.private'), {
      'issuer':     config.get('domain'),
      'algorithms': [
        'HS256'
      ]
    })

    const session = Logins.findOne({
      token
    })

    if (!await session) {
      throw new AuthenticationError('Invalid token')
    }
  } catch (error) {
    handle(error)
    throw new AuthenticationError(error.message)
  }

  return true
}
