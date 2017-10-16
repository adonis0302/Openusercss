// @flow
/* eslint no-underscore-dangle:0 */

import staticConfig from '../../config'
import {AuthenticationError} from '../../shared/custom-errors'
import jwt from 'jsonwebtoken'
import log from 'chalk-console'
import bcrypt from 'bcryptjs'

export default async (root, {email, password}: Object<String>, {Users, Logins}) => {
  const config = await staticConfig()
  const foundUser = await Users.findOne({
    email
  })

  const loginStarted = Date.now()
  let authResult = null

  try {
    authResult = await bcrypt.compare(password, foundUser.password)
  } catch (error) {
    throw new AuthenticationError('Invalid credentials')
  }

  if (!authResult) {
    throw new AuthenticationError('Invalid credentials')
  }

  log.info(`Authentication took ${Date.now() - loginStarted}ms`)
  const token = jwt.sign({
    'userId': foundUser._id
  }, config.get('keypair.private'), {
    'expiresIn': '60d',
    'issuer':    config.get('domain'),
    'algorithm': 'HS256'
  })
  const authItem = {
    token,
    'userId': foundUser._id
  }
  const loginPayload = {
    'auth': authItem,
    'user': foundUser
  }

  Logins.insert(authItem)

  return loginPayload
}
