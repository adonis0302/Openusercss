// @flow

import staticConfig from '../config'
import jwt from 'jsonwebtoken'
import {expected} from './custom-errors'

const {AuthenticationError} = expected

export default async (token: String, Session) => {
  const config = await staticConfig()

  try {
    jwt.verify(token, config.get('keypair.private'), {
      'issuer':     config.get('domain'),
      'algorithms': [
        'HS256'
      ]
    })

    const session = await Session.findOne({
      token
    })

    if (!await session) {
      throw new Error('Invalid token')
    }
  } catch (error) {
    throw new AuthenticationError(error.message)
  }

  return true
}
