import {request,} from 'graphql-request'
import {ObjectID,} from 'mongodb'
import jsonwebtoken from 'jsonwebtoken'

import test, {apiURL, context,} from '../lib/api'

test.serial('register', async (t) => {
  const regData = await request(apiURL, `
    mutation($username: String!, $password: String!, $email: String!) {
      register(
        displayname: $username
        password:    $password
        email:       $email
      ) {
        _id
      }
    }
  `, context)

  t.true(typeof regData.register._id === 'string')

  context.id = regData.register._id
})

test.serial('login session', async (t) => {
  const loginData = await request(apiURL, `
    mutation($email: String!, $password: String!) {
      login(
        email:    $email
        password: $password
      ) {
        _id
        token
        user {
          _id
        }
      }
    }
  `, context)
  const decodedToken = jsonwebtoken.decode(loginData.login.token)

  t.true(loginData.login.user._id === context.id)
  t.true(ObjectID.isValid(loginData.login._id))
  t.true(ObjectID.isValid(loginData.login.user._id))
  t.truthy(loginData.login.token)
  t.true(decodedToken.userId === context.id)
  t.true(decodedToken.iss === context.config.get('domain'))
})

test.serial('querying user id gives back username', async (t) => {
  const result = await request(apiURL, `
    query($id: ID!) {
      user(id: $id) {
        username
      }
    }
  `, context)

  t.deepEqual(result.user.username, context.username)
})
