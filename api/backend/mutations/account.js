import bcrypt from 'bcryptjs'
import raven from 'raven'
import jwt from 'jsonwebtoken'
import {cloneDeep,} from 'lodash'
import moment from 'moment'
import {
  sendEmail as transportEmail,
} from '../../email/mailer'
import mustAuthenticate from '../../../lib/enforce-session'
import staticConfig from '../../../lib/config'

const sendEmail = async (locals, {template,}) => {
  if (!locals.email) {
    throw new Error('No email address defined in locals')
  }
  if (!locals.user || !locals.oldUser) {
    throw new Error('Locals must include an oldUser and a user object')
  }

  const config = await staticConfig()
  const token = jwt.sign({
    'email': locals.email,
  }, config.get('keypair.clientprivate'), {
    'expiresIn': '1d',
    'issuer':    config.get('domain'),
    'algorithm': 'HS256',
  })

  let link = `https://openusercss.org/verify-email/${token}`

  if (process.env.NODE_ENV === 'development') {
    link = `http://localhost:5010/verify-email/${token}`
  }

  const result = await transportEmail({
    'to':     locals.email,
    'locals': {
      ...locals,
      link,
    },
    template,
  })

  return result
}

export default async (root, {token, email, password, displayname, bio, donationUrl,}, {User, Session,}) => {
  const session = await mustAuthenticate(token, Session)
  const config = await staticConfig()
  const saltRounds = parseInt(config.get('saltrounds'), 10)
  const {user,} = session
  const oldUser = cloneDeep(user)
  let link = null

  // Password resets
  if (password) {
    raven.captureBreadcrumb({
      'message': 'Changing password',
    })
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)

    user.password = hash
  }

  // Username changing
  if (displayname) {
    raven.captureBreadcrumb({
      'message': 'Changing displayname',
    })
    if (user.displayname === displayname) {
      throw new Error('This username is already the one you\'re currently using.')
    }

    user.displayname = displayname
    user.username = displayname.toLowerCase()
  }

  // E-mail address changing
  if (email) {
    raven.captureBreadcrumb({
      'message': 'Changing email',
    })
    if (user.email === email) {
      throw new Error('This e-mail address is already the one you\'re currently using')
    }

    user.pendingEmail = email
    user.emailVerified = false

    const verificationToken = jwt.sign({
      email,
    }, config.get('keypair.clientprivate'), {
      'expiresIn': '1d',
      'issuer':    config.get('domain'),
      'algorithm': 'HS256',
    })

    link = `https://openusercss.org/verify-email/${verificationToken}`
    if (process.env.NODE_ENV === 'development') {
      link = `http://localhost:5010/verify-email/${verificationToken}`
    }
  }

  if (bio) {
    raven.captureBreadcrumb({
      'message': 'Changing bio',
    })
    user.bio = decodeURIComponent(bio)
  }

  if (donationUrl || donationUrl === '') {
    raven.captureBreadcrumb({
      'message': 'Changing donationUrl',
    })
    user.donationUrl = donationUrl
  }

  user.lastSeen = moment().toJSON()
  user.lastSeenReason = 'changing account details'

  // Try to save the user object
  const savedUser = await user.save()

  // Only send notification emails if saving was successful
  if (password) {
    sendEmail({
      user,
      oldUser,
      'email': user.email,
    }, {
      'template': 'password-changed',
    })
    .catch(raven.captureException)
  }

  if (displayname) {
    sendEmail({
      user,
      oldUser,
      'newDisplayname': displayname,
      'email':          user.email,
    }, {
      'template': 'username-changed',
    })
    .catch(raven.captureException)
  }

  if (email) {
    sendEmail({
      'email': user.email,
      user,
      oldUser,
    }, {
      'template': 'email-reverification-previous',
    })
    .catch(raven.captureException)

    sendEmail({
      user,
      oldUser,
      email,
      link,
    }, {
      'template': 'email-reverification-next',
    })
    .catch(raven.captureException)
  }

  if (donationUrl && user.donationUrl !== oldUser.donationUrl) {
    sendEmail({
      'email': user.email,
      user,
      oldUser,
    }, {
      'template': 'donation-link-changed',
    })
    .catch(raven.captureException)
  }

  return savedUser
}
