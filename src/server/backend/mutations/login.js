// @flow
/* eslint no-underscore-dangle:0 */

import staticConfig from '../../config'
import {AuthenticationError} from '../../shared/custom-errors'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import bcrypt from 'bcryptjs'

export default async (root, {email, password}: Object<String>, {User, Session}) => {
  const config = await staticConfig()
  const foundUser = await User.findOne({
    email
  })

  let authResult = null

  try {
    authResult = await bcrypt.compare(password, foundUser.password)
  } catch (error) {
    throw new AuthenticationError('Invalid credentials')
  }

  if (!authResult) {
    throw new AuthenticationError('Invalid credentials')
  }

  const token = jwt.sign({
    'userId': foundUser._id
  }, config.get('keypair.private'), {
    'expiresIn': '60d',
    'issuer':    config.get('domain'),
    'algorithm': 'HS256'
  })

  const newSession = Session.create({
    'user':      foundUser,
    'expiresAt': Date.parse(moment().add(60, 'days')),
    'createdAt': Date.now(),
    token
  })

  return newSession.save()
}
