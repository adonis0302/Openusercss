import test from 'ava'
import {request,} from 'graphql-request'
import hat from 'hat'
import {connect,} from 'camo'
import {ObjectID,} from 'mongodb'
import jsonwebtoken from 'jsonwebtoken'

import staticConfig from '../../src/shared/config'
import User from '../../src/api/connector/schema/user'

const api = 'http://localhost:5000'
const username = `testuser-${hat(64)}`
const password = hat()
let userId = null

test.before('register', async (t) => {
  const config = await staticConfig()
  const connectionUrl = config.get('database.main')

  await connect(connectionUrl)
  const regData = await request(api, `
    mutation {
      register(
        displayname: "${username}"
        password:    "${password}"
        email:       "${process.env.TEST_EMAIL || 'nonexist@openusercss.org'}"
      ) {
        _id
      }
    }
  `)

  userId = regData.register._id
})

test('login session', async (t) => {
  const loginData = await request(api, `
    mutation {
      login(
        email:    "${process.env.TEST_EMAIL || 'nonexist@openusercss.org'}"
        password: "${password}"
      ) {
        _id
        token
        user {
          _id
        }
      }
    }
  `)
  const decodedToken = jsonwebtoken.decode(loginData.login.token)
  const config = await staticConfig()

  t.true(loginData.login.user._id === userId)
  t.true(ObjectID.isValid(loginData.login._id))
  t.true(ObjectID.isValid(loginData.login.user._id))
  t.truthy(loginData.login.token)
  t.true(decodedToken.userId === userId)
  t.true(decodedToken.iss === config.get('domain'))
})

test('querying user id gives back username', async (t) => {
  const result = await request(api, `
    query {
      user(id: "${userId}") {
        username
      }
    }
  `)

  t.deepEqual(result.user.username, username)
})

test.after.always('cleanup test account and themes', async (t) => {
  const testUser = await User.findOne({
    '_id': userId,
  })

  await testUser.delete()
})
