/* eslint no-underscore-dangle:0 */

import log from 'chalk-console'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import staticConfig from '../config'
import {AuthenticationError} from '../utils/custom-errors'
import mustAuthenticate from '../utils/must-authenticate'

export default {
  'Query': {
    'allUsers': async (root, data, {Users}) => {
      const foundUsers = await Users.find({})

      return foundUsers.toArray()
    },
    'allLogins': async (root, data, {Logins}) => {
      const foundLogins = await Logins.find({})

      return foundLogins.toArray()
    },
    'getEvilSecret': async (root, {token}, context) => {
      await mustAuthenticate(token)

      return 'Taking over the world on Tuesday!'
    }
  },
  'Mutation': {
    'register': async (root, {displayname, email, password}, {Users}) => {
      const saltRounds = 15
      const newUser = {
        displayname,
        email
      }
      const saltStarted = Date.now()
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(password, salt)

      log.info(`Salt generation took ${Date.now() - saltStarted}ms`)
      newUser.username = displayname.toLowerCase()
      newUser.password = hash
      const response = await Users.insert(newUser)

      return Object.assign({
        'id': response.insertedIds[0]
      }, newUser)
    },
    'login': async (root, {email, password}, {Users, Logins}) => {
      const config = await staticConfig()
      const foundUser = await Users.findOne({
        email
      })

      const loginStarted = Date.now()
      const authResult = await bcrypt.compare(password, foundUser.password)

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
  }
}
