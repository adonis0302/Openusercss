import staticConfig from '../../../shared/config'
import {expected,} from '../../../shared/custom-errors'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import bcrypt from 'bcryptjs'

const {AuthenticationError,} = expected
const invalidCreds = 'Invalid credentials'

export default async (root, {email, password,}, {User, Session, Theme, headers, connection,}) => {
  const config = await staticConfig()
  const requestedUser = await getUser({
    email,
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
    'userId': requestedUser._id,
  }, config.get('keypair.clientprivate'), {
    'expiresIn': '60d',
    'issuer':    config.get('domain'),
    'algorithm': 'HS256',
  })

  const newSession = Session.create({
    'user':      requestedUser,
    'expiresAt': moment().add(60, 'days').toJSON(),
    'createdAt': moment().toJSON(),
    'ua':        headers['user-agent'],
    'ip':        connection.remoteAddress,
    token,
  })

  requestedUser.lastSeen = moment().toJSON()
  requestedUser.lastSeenReason = 'logging in'

  const user = await requestedUser.save()

  newSession.user = user
  const session = await newSession.save()

  return session
}
