// @flow

import staticConfig from '../config'
import jwt from 'jsonwebtoken'
import {AuthenticationError} from './custom-errors'
import {handle} from '../utils/error-handler'

export default async (token: String) => {
  const config = await staticConfig()

  try {
    jwt.verify(token, config.get('keypair.private'), {
      'issuer':     config.get('domain'),
      'algorithms': [
        'HS256'
      ]
    })
  } catch (error) {
    handle(error)
    throw new AuthenticationError(error.message)
  }

  return true
}
