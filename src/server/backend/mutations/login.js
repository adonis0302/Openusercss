/* eslint no-underscore-dangle:0 */

import staticConfig from '../../config'
import {expected} from '../../shared/custom-errors'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import bcrypt from 'bcryptjs'

const {AuthenticationError} = expected
const invalidCreds = 'Invalid credentials'

export default async (root, {email, password}, {User, Session}) => {
  const config = await staticConfig()
  const requestedUser = await User.findOne({
    email
  })

  let authResult = null

  try {
    authResult = await bcrypt.compare(password, requestedUser.password)
  } catch (error) {
    throw new AuthenticationError(invalidCreds)
  }

  if (!authResult) {
    throw new AuthenticationError(invalidCreds)
  }

  const token = jwt.sign({
    'userId': requestedUser._id
  }, config.get('keypair.clientprivate'), {
    'expiresIn': '60d',
    'issuer':    config.get('domain'),
    'algorithm': 'HS256'
  })

  const newSession = Session.create({
    'user':      requestedUser,
    'expiresAt': Date.parse(moment().add(60, 'days')),
    'createdAt': Date.now(),
    token
  })

  return newSession.save()
}
